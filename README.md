# Northcoders House of Games API 
## Project Summary 
A REST API hosted online via Heroku for a game review website, Northcoders House of Games. It allows interaction with the database holding website content and user information. New data entries can be created, existing data can be retrieved (in JSON format), existing data can be updated, and existing data can be deleted. \
An overview of available endpoints can be found at https://nc-games-backend-snaranji01.herokuapp.com/api. Each endpoint description includes a short description, an example request and an example response.
## Hosted at
https://nc-games-backend-snaranji01.herokuapp.com/api

## Usage Instructions
### Clone using git:
```git clone https://github.com/snaranji01/nc-games-backend-public```
### Install dependencies
```npm install```
### Format your .env.development and .env.test files
Your .env.test file should include:   

* ```PGDATABASE``` : Your test Database name
* ```PGPASSWORD``` : Your test Database password

Your .env.development file should include:

* ```PGDATABASE``` : Your development Database name
* ```PGPASSWORD``` : Your development Database password
### Initialise local test and development databases
```npm run setup-dbs```
### Seed test database and run all tests in __tests__ file
```npm test```
### Seed development database
```npm run seed```
### Start development server locally
```npm run dev-server```
## My version information
|                       | Version                                                                                                                   |
|-----------------------|---------------------------------------------------------------------------------------------------------------------------|
| Node                  | v14.17.1                                                                                                                  |
| PostgreSQL            | 12.8 (Ubuntu 12.8-0ubuntu0.20.04.1) on x86_64-pc-linux-gnu, compiled by gcc (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0, 64-bit  |
| Base Operating System | Windows 10                                                                                                                |
| WSL                   | Version 2 Build 19041 Revision 1151  : Running Ubuntu 20.04.3 LTS                                                         |
|                       |                                                                                                                           |  |                                                        |   |   |   |   |   |   |   |   |