pipeline {
    agent any

    tools {
        nodejs 'Node20'
    }

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Basavaraj2003/mern-cicd.git',
                    credentialsId: '' // Leave empty if using public repo
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm --version'
                sh 'node --version'
                dir('client') {
                    sh 'npm ci'
                }
                dir('server') {
                    sh 'npm ci'
                }
            }
        }

        stage('Lint & Build') {
            steps {
                dir('client') {
                    sh 'npm run lint || true'
                    sh 'npm run build'
                }
                dir('server') {
                    sh 'npm run lint || true'
                }
            }
        }

        stage('Test') {
            steps {
                dir('client') {
                    sh 'npm test || true'
                }
                dir('server') {
                    sh 'npm test || true'
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application...'
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
        always {
            cleanWs()
        }
    }
}