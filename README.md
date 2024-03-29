# interruption-schedule

### Introduction

This repository contains a REST API implementation to get the interruption schedule of electricity power in your area using CEB Care outage calendar. As CEB has not published any public REST API for this purpose, you need to register in https://cebcare.ceb.lk via either a mobile app or a web app before using this API. You have to provide your username, password and the account number of your electricity bill as input parameters.

This API can be used to develop a power cut information notification (SMS, Emails, etc.) sender or integrate in to another service. If you like to report a bug or contribute some code please submit issues/pull requests. If you find this useful give this repo a star!

!!! Please note that CEB Care system can be down sometimes hence this API will not work.

*Hint: You can use the same idea in the code to develop an API for a website which doesn't provide a published API. However, you might need to change the logic time to time if the website is frequently updated.*

### Run node server
1. `git clone https://github.com/binodmx/interruption-schedule`
2. `cd interruption-schedule`
3. `npm install`
4. `npm start`

### Run docker image
`docker run -p 8080:8080 binodmx/interruption-schedule`

### Get interruption schedule
`curl 'http://localhost:8080?username=<username>&password=<password>&accountNumber=<accountNumber>'`
