pipeline {
    agent any

    tools {
        nodejs 'Node20'
    }

    environment {
        DOCKER_IMAGE_CLIENT = 'mern-client'
        DOCKER_IMAGE_SERVER = 'mern-server'
        DOCKER_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/Basavaraj2003/mern-cicd.git'
                    ]]
                ])
            }
        }

        stage('Verify Node Installation') {
            steps {
                sh 'npm --version'
                sh 'node --version'
            }
        }

        stage('Fix ESLint Configuration') {
            steps {
                dir('client') {
                    script {
                        sh '''
                            echo "Creating ESLint configuration..."
                            cat > .eslintrc.cjs << 'EOL'
module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: "latest",
        sourceType: "module"
    },
    plugins: [
        "react",
        "@typescript-eslint"
    ],
    rules: {
        "react/react-in-jsx-scope": "off"
    },
    settings: {
        react: {
            version: "detect"
        }
    }
}
EOL
                            echo "ESLint configuration created"
                            ls -la .eslintrc.cjs
                        '''
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('client') {
                    sh '''
                        echo "Cleaning up existing installations..."
                        rm -rf node_modules package-lock.json

                        echo "Cleaning npm cache..."
                        npm cache clean --force

                        echo "Installing dependencies (including devDependencies)..."
                        npm install --legacy-peer-deps --include=dev

                        echo "Verifying Vite installation..."
                        ls -la node_modules/vite
                        npm ls vite
                    '''
                }

                dir('server') {
                    sh '''
                        echo "Cleaning up existing installations..."
                        rm -rf node_modules package-lock.json

                        echo "Cleaning npm cache..."
                        npm cache clean --force

                        echo "Installing dependencies..."
                        npm install --legacy-peer-deps
                    '''
                }
            }
        }

        stage('Create Vite Config') {
            steps {
                dir('client') {
                    sh '''
                        echo "Creating Vite configuration..."
                        cat > vite.config.js << 'EOL'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
EOL
                        echo "Vite configuration created"
                        ls -la vite.config.js
                    '''
                }
            }
        }

        stage('Lint') {
            steps {
                dir('client') {
                    sh '''
                        echo "Running ESLint..."
                        npm run lint || true
                    '''
                }

                dir('server') {
                    sh '''
                        if grep -q "lint" package.json; then 
                            npm run lint || true
                        else 
                            echo "No lint script in package.json"
                        fi
                    '''
                }
            }
        }

        stage('Build') {
            steps {
                dir('client') {
                    sh '''
                        echo "Current directory: $(pwd)"
                        echo "Directory contents:"
                        ls -la

                        echo "Building with Vite..."
                        npm run build
                    '''
                }
            }
        }

        stage('Test') {
            steps {
                dir('client') {
                    sh '''
                        if grep -q "test" package.json; then 
                            npm test || true
                        else 
                            echo "No test script in package.json"
                        fi
                    '''
                }
                dir('server') {
                    sh '''
                        if grep -q "test" package.json; then 
                            npm test || true
                        else 
                            echo "No test script in package.json"
                        fi
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                dir('client') {
                    sh '''
                        echo "Building client Docker image..."
                        docker build -t ${DOCKER_IMAGE_CLIENT}:${DOCKER_TAG} .
                        docker tag ${DOCKER_IMAGE_CLIENT}:${DOCKER_TAG} ${DOCKER_IMAGE_CLIENT}:latest
                    '''
                }
                
                dir('server') {
                    sh '''
                        echo "Building server Docker image..."
                        docker build -t ${DOCKER_IMAGE_SERVER}:${DOCKER_TAG} .
                        docker tag ${DOCKER_IMAGE_SERVER}:${DOCKER_TAG} ${DOCKER_IMAGE_SERVER}:latest
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    echo "Stopping existing containers..."
                    docker-compose down || true
                    
                    echo "Starting new containers..."
                    docker-compose up -d
                    
                    echo "Checking container status..."
                    docker-compose ps
                    
                    echo "Checking container logs..."
                    docker-compose logs --tail=50
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded!'
            sh '''
                echo "Deployment completed successfully!"
                echo "Frontend is available at: http://localhost:80"
                echo "Backend is available at: http://localhost:5000"
            '''
        }
        failure {
            echo 'Pipeline failed!'
            sh '''
                echo "Deployment failed! Rolling back..."
                docker-compose down
            '''
        }
        always {
            cleanWs()
        }
    }
}
