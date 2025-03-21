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
      command: ["cat"]
      tty: true
      securityContext:
        privileged: true
      volumeMounts:
        - name: docker-sock
          mountPath: /var/run/docker.sock
  volumes:
    - name: docker-sock
      hostPath:
        path: /var/run/docker.sock
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
                git branch: 'master', url: 'https://github.com/nitin1materialplus/LRA.git'
            }
        } // <-- This closing brace was missing
    } // <-- Closing brace for stages
} // <-- Closing brace for pipeline
