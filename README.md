Midterm Resource Wall Project "DevTips"
=========


# DevTips Project

DevTips is a website where everybody can share code snippets or links to articles, blogs, videos. 

## Main features
1. Home
- For a user who is logged in, compose a new tip, applying different types of rendering to different types of data. Select the data of your choice and app will redirect you to page for newly created tip.
- Like and bookmark tips, allowing you to return to view those tips later!
- Pagination functionality includes buttons at bottom of page allows a single webpage to store many pages of tips, limited to 150 and paginated in sets of 10.
- Titles and other elements of tips contain hyperlinks to redirect to the stored URL in question.
2. User
- Stores all tips created by the user in question on one page.
- Contains specific data, links, pertaining to the user in question.
3. Tip
- Contains a render of the singular tip in question, with information on the creator of the tip to the side.
- Comments are displayed below for each tip, and a comment form is available to a user who is logged to add a comment for the tip in question.

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

