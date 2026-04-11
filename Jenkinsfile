pipeline {
    agent any

    stages {
        stage('Clone Repo') {
            steps {
                git 'https://github.com/mhaseebhassan/tekron.git'
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

        stage('Deploy') {
            steps {
                sh 'docker stop tekron || true'
                sh 'docker rm tekron || true'
                sh 'docker run -d -p 80:3000 --name tekron haseebbhinder/tekron'
            }
        }
    }
}