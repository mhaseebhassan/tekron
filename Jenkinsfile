pipeline {
    agent any

    stages {
        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/mhaseebhassan/tekron.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t haseebbhinder/tekron .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh 'docker push haseebbhinder/tekron'
            }
        }

        stage('Deploy (Part II)') {
            steps {
                sh 'docker rm -f tekron || true'
                sh 'docker run -d -p 3001:3000 --name tekron haseebbhinder/tekron'
            }
        }
    }
}