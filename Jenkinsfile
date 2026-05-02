pipeline {
    agent any

    environment {
        DOCKER_HUB_REPO = "haseebbhinder/tekron"
        COMMITTER_EMAIL = sh(script: "git log -1 --pretty=format:'%ae'", returnStdout: true).trim()
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/mhaseebhassan/tekron.git'
            }
        }

        stage('Build Application') {
            steps {
                sh 'docker-compose build app'
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    try {
                        sh 'docker-compose up -d db app'
                        sh 'sleep 10' // Give app time to start
                        sh 'docker-compose up --abort-on-container-exit tests'
                    } finally {
                        // Extract report from container before stopping
                        sh 'docker cp $(docker-compose ps -q tests):/app/report.html ./selenium-report.html'
                        sh 'docker-compose down'
                    }
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'selenium-report.html', fingerprint: true
                }
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                sh "docker tag haseebbhinder/tekron ${DOCKER_HUB_REPO}:latest"
                // sh "docker push ${DOCKER_HUB_REPO}:latest" // Uncomment if Docker Hub creds are set
                sh 'docker rm -f tekron-prod || true'
                sh "docker run -d -p 3001:3000 --name tekron-prod ${DOCKER_HUB_REPO}:latest"
            }
        }
    }

    post {
        always {
            emailext (
                subject: "Assignment 3: Test Results for ${currentBuild.fullDisplayName}",
                body: """
                    <h3>Build Status: ${currentBuild.currentResult}</h3>
                    <p>Build URL: <a href='${env.BUILD_URL}'>${env.BUILD_URL}</a></p>
                    <p>Hello, the automated tests for the Tekron application have completed. Check the attached report for details.</p>
                """,
                to: "${COMMITTER_EMAIL}, qasimalik@gmail.com",
                attachmentsPattern: 'selenium-report.html',
                attachLog: true
            )
        }
    }
}