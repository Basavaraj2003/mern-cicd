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
                    sh 'npm run lint'
                    sh 'npm run build'
                }
            }
        }
        stage('Lint & Test Backend') {
            steps {
                dir('server') {
                    sh 'npm run lint'
                    // Uncomment the next line if you have tests
                    // sh 'npm test'
                }
            }
        }
        // Optional: Add deploy or archive steps here
        // stage('Deploy') {
        //     steps {
        //         echo 'Deploying...'
        //     }
        // }
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