pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup NodeJS') {
            steps {
                // Use Jenkins' built-in NodeJS tool
                tool name: 'NodeJS', type: 'nodejs'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('client') {
                    bat 'npm install'  // Using bat for Windows
                }
                dir('server') {
                    bat 'npm install'
                }
            }
        }

        stage('Lint & Build Frontend') {
            steps {
                dir('client') {
                    bat 'npm run lint'
                    bat 'npm run build'
                }
            }
        }

        stage('Lint Backend') {
            steps {
                dir('server') {
                    bat 'npm run lint'
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