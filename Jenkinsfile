pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    jenkins/label: "node-app"
spec:
  containers:
  - name: dind
    image: docker:20.10.24-dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    volumeMounts:
    - mountPath: "/var/lib/docker"
      name: "dind-storage"
  - name: docker
    image: docker:20.10.24
    command:
    - cat
    tty: true
    env:
    - name: DOCKER_HOST
      value: "tcp://localhost:2375"
  - name: git
    image: alpine/git
    command:
    - cat
    tty: true
  - name: kubectl
    image: bitnami/kubectl
    command:
    - cat
    tty: true
  volumes:
  - emptyDir: {}
    name: "dind-storage"
"""
        }
    }

    stages {
        stage('Checkout Code') {
            steps {
                container('git') {
                    git branch: 'master', credentialsId: 'github-token', url: 'https://github.com/nitin1materialplus/LRA.git'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                container('docker') {
                    sh 'docker build -t test-harbor.lra-poc.com/library/node-app:latest node-app/'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                container('docker') {
                    withDockerRegistry([url: 'https://test-harbor.lra-poc.com', credentialsId: 'harbor-credentials']) {
                        sh 'docker push test-harbor.lra-poc.com/library/node-app:latest'
                    }
                }
            }
        }

        stage('Deploy Application') {
            steps {
                container('kubectl') {
                    sh 'kubectl apply -f k8s/deployment.yaml'
                }
            }
        }
    }
}
