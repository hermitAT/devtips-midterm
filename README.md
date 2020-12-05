Midterm Resource Wall Project "DevTips"
=========


# DevTips Project

Tweeter is a single-page application which aimed to help people exchange short messages.

## Main features
- Follow up other people tweets in the feed
- Write your own tweet, the only limit for your thoughts is 140 characters per tweet
- Use Tweeter on any screen - it automatically adapts to desktop or mobile device presentation
- And all this nicely animated

## Final Product

- ### Home Page

!["Home Page"](https://github.com/pavel-piatetskii/midterm-resourcewall/blob/master/docs/home-page.png)

- ### Compose new tip
!["Home Page"](https://github.com/pavel-piatetskii/midterm-resourcewall/blob/master/docs/compose-tip.png)

- ### Paginator
!["Home Page"](https://github.com/pavel-piatetskii/midterm-resourcewall/blob/master/docs/paginator.png)

- ### Search
!["Home Page"](https://github.com/pavel-piatetskii/midterm-resourcewall/blob/master/docs/search-page.png)

- ### User page
!["Home Page"](https://github.com/pavel-piatetskii/midterm-resourcewall/blob/master/docs/user-page.png)

- ### Tip page
!["Home Page"](https://github.com/pavel-piatetskii/midterm-resourcewall/blob/master/docs/tip-page.png)

## Dependencies

- Bcrypt 5.0.0
- Body-parser 1.19.0
- Chalk 2.4.2
- Cookie-session 1.4.0
- Dotenv 2.0.0
- EJS 2.6.2
- Express 4.17.1
- Morgan 1.9.1
- Node-sass-middleware 0.11.0
- PG 6.4.2
- PG-native 3.0.0


## Getting Started

1. Setup local database using following command, replace 'vagrant' as necessary:
    `psql -U vagrant -d template1`
2. Create user ad allow that user to own the new database;
    `CREATE ROLE labber WITH LOGIN password 'labber';`
    `CREATE DATABASE midterm OWNER labber;`
3. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
4. Update the .env file with your correct local information
  - username: `labber`
  - password: `labber`
  - database: `midterm`
5. Install dependencies: `npm i`
6. Fix to binaries for sass: `npm rebuild node-sass`
7. Reset database: `npm run db:reset`
8. Run the server: `npm run local`
9. Visit `http://localhost:8080/`
10. Login as `tyler_sikorski@sample.com` with password `password` to get a feel for the features!

