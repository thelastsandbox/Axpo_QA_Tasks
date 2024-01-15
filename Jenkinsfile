pipeline {
    agent any
    parameters{
        string(name: "SPEC", defaultValue: "cypress/e2e/**/**", description:"cypress/e2e/spec.cy.spec")
        choice(name: "BROWSER", choices:['chrome','edge','firefox'], description : "Escoja un browser")
    }

    options{
        ansiColor('xterm')
    }

    stages{
        stage('Build'){
            steps{echo "Build Application"}
        }
        stage('Testing'){
            steps{
                bat "npm i"
                bat "npx cypress run --browser ${BROWSER}  --spec ${SPEC}"
                }

            }
        stage('Deploy'){
            steps{echo "Deploying Application"}
        }

    }
    post{
        always{
            publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: true, reportDir: 'cypress/reports', reportFiles: 'index.html', reportName: 'HTML Report', reportTitles: '', useWrapperFileDirectly: true])
        }
    }
}
