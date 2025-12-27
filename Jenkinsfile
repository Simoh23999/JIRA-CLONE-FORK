pipeline {
	agent any

	stages{
		stage('build'){
			steps{
				dir('frontend') {
					echo "${pwd()}"
					echo 'build frontend ...'
					nodejs('node-25.2.1') {
						echo 'npm install ..'
					  sh 'npm install'
						echo 'run build'
					  sh 'npm run build'
					}


				}
				dir('Backend') {
					echo 'build backend ...'
					//sh 'mvn install'
					//sh 'mvn build'
				}
			}

		}

	}

}
