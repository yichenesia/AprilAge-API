# Team 14: AprilAge (Ollon)

## Video

Our D4 demo video can be viewed at the following link: 
https://www.youtube.com/watch?v=jQ3irI9iFBI&feature=youtu.be


## Description

This RESTful API is a minimum-viable-product (MVP) of the AprilAge Web API proposed by Ollon. 

Prior to the development of this API, AprilAge’s application - which uses machine learning to age an individual’s face according to various factors, such as their smoking consumption, was accessible only through kiosks and desktop applications. 

With the development of this web API, AprilAge’s aging engine will be made accessible for users universally and simultaneously through a web-app, and also replace the older version which was made using outdated technology. This API is meant to be a bridge between the aging engine and the future web application that allows multiple users to simultaneously experience the aging software. In other words, it will allow a future developer designing a web application to utilize the aging engines by using this API as a middleware.

## Key Features

At the moment, we have implemented a number methods (routes) that the user can access via Postman. To summarize, one can create a new user in the API (similar to registration) by giving their email and password which is stored in an object called an aging document. 

They can then upload images to the AWS S3 bucket and our database to be aged (which is currently not implemented as the April Age aging engine was not provided by our partner). The user can then create an “aging sequence” by selecting a series of fields that will impact the aged image such as sun exposure, smoking, etc. 

Once all this information is provided the user can retrieve an aged image or an updated aging document. One can also view or delete an aging document by providing their email. They can view all their aging results (which may contain multiple sequences of aged images) for a specific aging document.

One also has the option of deleting a specific aging document given a docID and a result given a resultID.

## Instructions and Development Requirements
### Requirements
- OS: Windows 10 or MacOS 10.14+
- [Git](https://git-scm.com/downloads)
- Git Bash (installed with Git)
- [npm](https://www.npmjs.com/)
- [Postman Desktop](https://www.postman.com/)
- (For a developer) Some kind of code compiler such as: [VS Code](https://code.visualstudio.com)
 
### Installation
Using Git Bash, clone this repository:
```bash
git clone https://github.com/csc301-fall-2020/team-project-14-ollon-d4.git
cd team-project-14-ollon-d4
```
 
### Usage
Set the environment source:
```bash
source env.sh
```
Install dependencies:
```bash
npm install
```
 
Start local server:
```bash
npm start
```
Now you should be able to access our API either through Postman or your web browser of choice at: `http://localhost:3003/`.

### Postman Usage
Import [this Postman collection](https://www.getpostman.com/collections/36785b0c89b9f105ad65) to run sample test routes. To import:

1. Open the **Postman** app.
2. On the top left , click **Import** (next to + New).
3. In the window that opens up, click **Link**.
4. Enter the URL linked above and click **Continue**.
5. Select **Import**.
6. On the left-hand side, you should see a folder under the Collections tab with 16 requests. Click to expand.
7. To test a route, click on a request and then click the blue **Send** button.

For this specific route, the user must upload an actual image file.
```
POST /images
 
Description: Upload given image to the database
 
http://localhost:3003/images
 
Body (form-data):
    key: image (file)
    Upload image file in “values” section
Expected Response: Status 200
```

To upload an image, go to the **Body** tab and click **Select Files** in the cell under the VALUE heading. After choosing an image file, click Send.
 
#### List of Routes:
 
 
- `GET /users`
  - Get all users
- `POST /create_user`
  - Create a new user with the given params (email, first name, last name, password)
- `GET /user_info`
  - Get user by provided email 
- `GET /status`
  - A check to make sure the api is connected
- `POST /images`
  - Upload given image to the database
- `GET /images/:id`
  - Retrieve image `id` from database 
- `GET /users/:email/documents/:docID`
  - Retrieve agingDocument `docID`, which belongs to user `email`
- `DELETE /users/:email/documents/:docID`
  - Delete agingDocument `docID`, which belongs to user `email`
- `GET /users/:email/documents/:docID/points`
  - Returns an image with the feature points 
- `POST /users/:email/documents/:docID/aging`
  - Runs the aging algorithm on the image referenced by `docID`
- `GET /users/:email/documents/:docID/status`
  - Gets the status of a `docID`
- `GET /users/:email/documents`
  - Retrieves all of user `email`’s aging documents
- `POST /users/:email/documents`
  - Creates a new aging document for user `email` with the given parameters 
- `GET /users/:email/documents/results`
  - Retrieves all of user `email`’s aging results 
- `GET /users/:email/userInfo`
  - Retrieves user `email`’s information
- `GET /users/:email/documents/:docID/results`
  - Retrieves all of user `email`’s aging results related to aging document `docID`
- `GET /users/:email/documents/:docID/results/:resultID`
  - Retrieves result `resultID` for user `email` from aging Document `docID`
- `GET /users/:email/documents/:docID/results/:resultID.zip`
  - Retrieves result `resultID` for user `email` from aging Document `docID` as a zip file
  - `/users/admin@example.com/documents/1/results/1.zip` needs to be run in browser only, not in Postman
- `DELETE /users/:email/documents/:docID/results/:resultID`
  - Deletes result `resultID` for user `email` from aging Document `docID`

## Deployment and Git (Bitbucket) Workflow

For this project, our partner wanted us to use their Bitbucket repositories, so we have been working there. For this deliverable, we will be mirroring this repository onto Github. While developing, we created a `dev` branch for development. We divided up the features that needed to be developed amongst ourselves and worked off a separate branch off of `dev` when developing our own code. Each feature has several routes that one person would be in charge of and the branch would be named `feature/<feature name>` accordingly. Because each feature has its own set of `controller`, `model`, and `route` files, merge conflicts were close to none. 

When we finished, we would push to the repository and create a pull request to merge the update into `dev`. The person that made the PR would then notify the team chat and another team member would then look over the code before approving the PR and merging it into dev. The `master` branch is left alone until the deliverable is complete, at which point we will merge `dev` into `master` (i.e. before submitting D2, we will merge).

Our overall deployment process is as follows: pull from `dev`, branch from `dev` with an appropriate branch name for your feature, and write your code for that feature. Test thoroughly locally (since we don’t yet have the API hosted on the cloud). Testing involved populating, accessing, and manipulating our AWS-hosted database with information. Finally, once the feature is done, a PR should be opened and another team member will look over it before approving and merging to `dev`. After everyone has merged their work to `dev` and we have thoroughly tested `dev` to make sure nothing breaks, we merge `dev` into `master`.  

In the couple of days following our D2 deadline, we will be using CI/CD to deploy to AWS (we had to wait on our partner to give pipeline admin permissions, which were just granted after our demo on November 23rd). The setup file for CI/CD already exists in `bitbucket-pipelines.yml`, where you can see the name of the branch we will be using for deployment (`aws-staging`) and the prepared Lambda functions. 

## Licenses
