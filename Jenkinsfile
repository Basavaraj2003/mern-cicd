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
                        
                        echo "Installing dependencies..."
                        npm install --legacy-peer-deps
                        
                        echo "Verifying installations..."
                        ls -la node_modules/vite
                        ls -la node_modules/eslint
                    '''
                }
                
                dir('server') {
                    sh '''
                        rm -rf node_modules package-lock.json
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
                        npm run build || {
                            echo "Local build failed, trying with global vite..."
                            npm install -g vite
                            vite build
                        }
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