pipeline {
    agent any

    tools {
        nodejs 'Node.js 18.x'  // Make sure this matches your Jenkins NodeJS installation name
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
                    sh 'npm install'  // Using sh since Jenkins container is Linux-based
                }
                dir('server') {
                    sh 'npm install'
                }
            }
        }

        stage('Lint & Build Frontend') {
            steps {
                dir('client') {
                    sh 'npm run lint'
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