# Project Title: NotesNow

## Project Description

A marketplace for cheat sheets that allows users to upload and download pdf cheat sheets easily and accessibly.
We used the MongoDb, Express.Js, React.Js, Node.Js also known as the MERN stack framework. MERN stack has many advantages, with the primary one being one of the best tech stack for REST Api's as a middleware between front-end and back-end. This repository is mainly used to provide API endpoints for the front-end to call.

## Instructions to set up the project (Packages/Dependencies)

1. Ensure node version is at least ^14.15.5
2. Run "npm install" to download the necessary dependencies
3. Run "npm run start" to start the script.

## Resources used in the project

-   Postman [Test API endpoints]
-   Cloudinary [PDF hosting sites for public URL retrieval]
-   Ngrok [Creates network tunnel to expose local code to the internet]
-   Airtable [Backup hosting site in case PDF url expires]
-   Nodemon [automatically restarting the node application when file changes in the directory are detected]

One important dependencies used is nodemon as it helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected.

## Workflow of code

1. Backend receives dataURL of PDF files from front end
2. Utilize Cloudinary to upload PDF to cloud
3. Utilize Airtable to upload PDF to Airtable Cloud as back-up in case of file expiry in Cloudinary (since we are using the free plan in Cloudinary)
4. Frontend retrieves PDF from from either Cloudinary or Airtable.

## Features of the code

-   CRUD Api
-   Session creation and extension
-   Password hasing and encryption
