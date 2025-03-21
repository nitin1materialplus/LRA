pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
    - name: jnlp
      image: jenkins/inbound-agent
      resources:
        limits:
          cpu: 1
          memory: 512Mi
        requests:
          cpu: 500m
          memory: 256Mi
    - name: git
      image: alpine/git
      command: ["sleep", "infinity"]
    - name: kubectl
      image: bitnami/kubectl
      command: ["sleep", "infinity"]
    - name: kaniko
      image: gcr.io/kaniko-project/executor:latest
      command:
        - "/kaniko/executor"
      args:
        - "--dockerfile=Dockerfile"
        - "--context=dir:///workspace/node-app"
        - "--destination=test-harbor.lra-poc.com/library/node-app:latest"
        - "--skip-tls-verify"
      volumeMounts:
        - name: kaniko-secret
          mountPath: /kaniko/.docker
          readOnly: true
  volumes:
    - name: kaniko-secret
      secret:
        secretName: harbor-credentials
"""
        }
    }
    environment {
        HARBOR_REGISTRY = "test-harbor.lra-poc.com"
        IMAGE_NAME = "library/node-app"
        IMAGE_TAG = "latest"
    }
    stages {
        stage('Checkout Code') {
            steps {
                container('git') {
                    git credentialsId: 'github-token', url: 'https://github.com/nitin1materialplus/LRA.git'
                }
            }
        }
        stage('Build and Push Docker Image') {
            steps {
                container('kaniko') {
                    sh """
                        /kaniko/executor --dockerfile=Dockerfile \
                                         --context=dir:///workspace/node-app \
                                         --destination=$HARBOR_REGISTRY/$IMAGE_NAME:$IMAGE_TAG \
                                         --skip-tls-verify
                    """
                }
            }
        }
        stage('Deploy via ArgoCD') {
            steps {
                container('kubectl') {
                    sh """
                        kubectl apply -f helm/values.yaml
                    """
                }
            }
        }
    }
}
