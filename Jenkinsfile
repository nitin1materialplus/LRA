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
    - name: docker
      image: docker:20.10.24
      command: ["sh", "-c", "sleep infinity"]
      env:
        - name: DOCKER_HOST
          value: tcp://localhost:2375
      volumeMounts:
        - name: docker-sock
          mountPath: /var/run/docker.sock
    - name: dind
      image: docker:20.10.24-dind
      securityContext:
        privileged: true
      env:
        - name: DOCKER_TLS_CERTDIR
          value: ""
      volumeMounts:
        - name: dind-storage
          mountPath: /var/lib/docker
    - name: git
      image: alpine/git
      command: ["sleep", "infinity"]
    - name: kubectl
      image: bitnami/kubectl
      command: ["sleep", "infinity"]
  volumes:
    - name: docker-sock
      emptyDir: {}
    - name: dind-storage
      emptyDir: {}
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
        stage('Build Docker Image') {
            steps {
                container('docker') {
                    sh """
                        docker build -t $HARBOR_REGISTRY/$IMAGE_NAME:$IMAGE_TAG node-app/
                    """
                }
            }
        }
        stage('Push to Harbor') {
            steps {
                container('docker') {
                    withDockerRegistry([credentialsId: 'harbor-credentials', url: 'https://test-harbor.lra-poc.com']) {
                        sh "docker push $HARBOR_REGISTRY/$IMAGE_NAME:$IMAGE_TAG"
                    }
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
