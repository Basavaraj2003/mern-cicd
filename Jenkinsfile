pipeline {
    agent any

    tools {
        nodejs 'Node20'
    }

    environment {
        NODE_ENV = 'production'
        PATH = "$PATH:/var/jenkins_home/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/Node20/bin"
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
                // Print versions for debugging
                sh 'npm --version'
                sh 'node --version'
                
                // Install global dependencies
                sh 'npm install -g vite eslint typescript'
                
                // Client dependencies
                dir('client') {
                    sh '''
                        npm ci
                        npm install --save-dev @vitejs/plugin-react vite
                        npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
                    '''
                }
                
                // Server dependencies
                dir('server') {
                    sh 'npm ci'
                }
            }
        }

        stage('Lint & Build') {
            steps {
                dir('client') {
                    // Use npx to ensure we're using local installations
                    sh 'npx eslint . --ext .js,.jsx,.ts,.tsx || true'
                    sh 'npx vite build'
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
                // Add your deployment steps here
                // Example: Deploy to a server or cloud platform
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded!'
            // Add any success notifications here
        }
        failure {
            echo 'Pipeline failed!'
            // Add any failure notifications here
        }
        always {
            cleanWs()
        }
    }
}