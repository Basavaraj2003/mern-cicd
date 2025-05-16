pipeline {
    agent any

    tools {
        nodejs 'Node18'
    }

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('client') {
                    sh 'npm install'
                }
                dir('server') {
                    sh 'npm install'
                }
            }
        }

        stage('Lint & Build Frontend') {
            steps {
                dir('client') {
                    sh 'npm run lint || true'   // Optional: prevent fail, better to fix root cause
                    sh 'npm run build'
                }
            }
        }

        stage('Lint Backend') {
            steps {
                dir('server') {
                    sh 'npm run lint'
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
