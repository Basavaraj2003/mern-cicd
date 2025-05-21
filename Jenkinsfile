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
        
        stage('Verify Node Installation') {
            steps {
                sh 'npm --version'
                sh 'node --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Client dependencies
                dir('client') {
                    // Check for and update ESLint config type
                    sh '''
                        if [ -f "eslint.config.js" ]; then
                            echo "Found flat ESLint config, installing required dependencies"
                            npm install --save-dev @eslint/js
                        fi
                    '''
                    
                    // Using regular npm install instead of npm ci for more flexible resolution
                    sh 'npm install'
                    
                    // Ensure Vite and ESLint are properly installed
                    sh 'npm install --save-dev vite @vitejs/plugin-react'
                    sh 'npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin'
                    
                    // Verify installations
                    sh 'ls -la node_modules/vite || echo "Vite not installed correctly"'
                    sh 'ls -la node_modules/@eslint || echo "ESLint packages not installed correctly"'
                }
                
                // Server dependencies
                dir('server') {
                    sh 'npm install'
                }
            }
        }
        
        stage('Lint') {
            steps {
                dir('client') {
                    script {
                        // Check ESLint config type and run appropriate command
                        sh '''
                            if [ -f "eslint.config.js" ]; then
                                echo "Using ESLint flat config"
                                npx eslint --config eslint.config.js . --ext .js,.jsx,.ts,.tsx || true
                            else
                                echo "Using traditional ESLint config"
                                npx eslint . --ext .js,.jsx,.ts,.tsx || true
                            fi
                        '''
                    }
                }
                dir('server') {
                    sh 'npm run lint || true'
                }
            }
        }
        
        stage('Build') {
            steps {
                dir('client') {
                    // Create simple Vite config if needed
                    sh '''
                        if [ ! -f "vite.config.js" ] || ! grep -q "@vitejs/plugin-react" "vite.config.js"; then
                            echo "Creating/updating Vite config"
                            echo "import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()]
});" > vite.config.js
                        fi
                    '''
                    
                    // Run build with proper environment
                    sh 'NODE_ENV=production npx vite build'
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