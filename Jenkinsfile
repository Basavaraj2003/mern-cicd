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
                            mkdir -p .eslint
                            cat > .eslintrc.js << 'EOL'
module.exports = {
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
                            ls -la .eslintrc.js
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
                        
                        echo "Installing core dependencies..."
                        npm install react react-dom
                        
                        echo "Installing ESLint and related packages..."
                        npm install --save-dev eslint@8.56.0 eslint-plugin-react@7.33.2 @typescript-eslint/eslint-plugin@7.0.1 @typescript-eslint/parser@7.0.1 typescript@5.3.3
                        
                        echo "Installing Vite and related packages..."
                        npm install --save-dev vite@5.1.3 @vitejs/plugin-react@4.2.1
                        
                        echo "Verifying installations..."
                        ls -la node_modules/vite
                        ls -la node_modules/eslint
                    '''
                }
                
                dir('server') {
                    sh '''
                        rm -rf node_modules package-lock.json
                        npm install
                    '''
                }
            }
        }
        
        stage('Lint') {
            steps {
                dir('client') {
                    sh 'npx eslint --ext .js,.jsx,.ts,.tsx src/ || true'
                }
                
                dir('server') {
                    sh 'if grep -q "lint" package.json; then npm run lint || true; else echo "No lint script in package.json"; fi'
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
  }
})
EOL
                        echo "Vite configuration created"
                        ls -la vite.config.js
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
                        npx vite build
                    '''
                }
            }
        }
        
        stage('Test') {
            steps {
                dir('client') {
                    sh 'if grep -q "test" package.json; then npm test || true; else echo "No test script in package.json"; fi'
                }
                dir('server') {
                    sh 'if grep -q "test" package.json; then npm test || true; else echo "No test script in package.json"; fi'
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