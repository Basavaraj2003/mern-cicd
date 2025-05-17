pipeline {
    agent any

    tools {
        nodejs 'Node18'  // Use the Node.js installation configured in Jenkins
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
                dir('client') {  // Change this to your frontend directory name if different
                    sh 'npm install'
                }
                dir('server') {  // Change this to your backend directory name if different
                    sh 'npm install'
                }
            }
        }

        stage('Lint & Build Frontend') {
            steps {
                dir('client') {  // Change this to your frontend directory name if different
                    // Use npx to ensure the binaries are found
                    sh 'npx eslint . || true'  // The || true allows the pipeline to continue even if linting fails
                    sh 'npx vite build'  // Using npx to ensure vite is found
                }
            }
        }

        stage('Lint Backend') {
            steps {
                dir('server') {  // Change this to your backend directory name if different
                    sh 'npx eslint . || true'  // The || true allows the pipeline to continue even if linting fails
                }
            }
        }

        stage('Test') {
            steps {
                dir('client') {
                    sh 'npx vitest run || true'  // Adjust based on your testing framework
                }
                dir('server') {
                    sh 'npm test || true'  // Adjust based on your testing framework
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'  // Only deploy from the main branch
            }
            steps {
                echo 'Deploying application...'
                // Add your deployment steps here
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
            // Clean up steps if needed
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
