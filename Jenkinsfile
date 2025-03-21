pipeline {
    agent {
        kubernetes {
            image 'jenkins/agent-docker'
            args '--privileged -v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    environment {
        HARBOR_REGISTRY = "test-harbor.lra-poc.com/library/node-app"
        IMAGE_TAG = "latest"
    }
    stages {
        stage('Checkout Code') {
            steps {
                git 'https://github.com/nitin1materialplus/LRA.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh "cd node-app/"
                sh "docker build -t ${HARBOR_REGISTRY}:${IMAGE_TAG} ."
            }
        }
        stage('Push to Harbor') {
            steps {
                withDockerRegistry([credentialsId: 'harbor-credentials', url: 'https://test-harbor.lra-poc.com']) {
                    sh "docker push ${HARBOR_REGISTRY}:${IMAGE_TAG}"
                }
            }
        }
        stage('Deploy via ArgoCD') {
            steps {
                sh "kubectl apply -f helm/values.yaml"
            }
        }
    }
}
