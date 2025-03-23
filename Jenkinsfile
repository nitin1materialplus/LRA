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
  - name: argocd
    image: quay.io/argoproj/argocd:v2.7.4  # Add the correct ArgoCD image
    securityContext:
      runAsUser: 0  # Run as root
    command: ["/bin/sh", "-c"]
    args:
      - "apt update && apt install -y curl iputils-ping dnsutils telnet netcat; sleep infinity"
    tty: true
  volumes:
  - emptyDir: {}
    name: "dind-storage"
"""
        }
    }
    environment {
        ARGOCD_SERVER = "https://test-argocd.lra-poc.com"
    }
    stages {

        stage('Trigger ArgoCD Sync') {
            steps {
                container('argocd') {
                        sh '''
                        argocd login test-argocd.lra-poc.com --username admin --password Charvisuhani@1963 --insecure
                        argocd app list --grpc-web
                        '''
                }
            }
        }
    }
}
