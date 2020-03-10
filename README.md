# API Documentation

#### Backend deployed at [heroku](https://story-squad.herokuapp.com/) <br>

## Getting started

To get the server running locally:

-   Clone this repo
-   **yarn install --production=false** to install all required dependencies (dev environment specified for @types)
-   **pipenv run yarn dev** to start the local server within .py env required for scripts
-   **yarn dev** to start the local server
-   **yarn build** to build production version
-   **yarn start** to start built production version
-   **yarn test** to start server using testing environment
-   **yarn typorm** to use typeorm CLI commands on a staging or production environment
-   **yarn typeorm-dev** to use typeorm CLI commands on the development environment
-   **yarn connection** to output connection information for a staging or production database

### Backend framework

#### Express

-   Useful libraries such as helmet and CORS.
-   Well documented.

#### TypeORM

-   Simplifies database creation, connections, queries, etc
-   Plays well with Typescript
-   Simple seeding.

#### Jest

-   Maintains consistency with front-end testing

#### SuperTest

-   Simplifies endpoint testing
-   Integration testing

## Endpoints

#### Authorization Routes

| Method | Endpoint         | Access Control | Description                                 |
| ------ | ---------------- | -------------- | ------------------------------------------- |
| POST   | `/auth/register` | all users      | Creates parent account and Stripe customer. |
| USE    | `/auth/login`    | adult users    | Returns parent token.                       |

#### Admin Routes

| Method | Endpoint          | Access Control | Description                       |
| ------ | ----------------- | -------------- | --------------------------------- |
| GET    | `/admin/`         | admin users    | Returns list of admins/moderators |
| GET    | `/admin/me`       | admin users    | Returns self information          |
| GET    | `/admin/:id`      | admin users    | Returns matching admins/moderator |
| POST   | `/admin`          | admin users    | Returns added admin/moderator id  |
| POST   | `/admin/login`    | admin users    | Returns admin token               |
| PUT    | `/admin/register` | admin users    | Returns admin token               |

#### Parent Routes

| Method | Endpoint      | Access Control | Description               |
| ------ | ------------- | -------------- | ------------------------- |
| GET    | `/parents/me` | adult users    | Returns logged in parent. |

#### Child Routes

| Method | Endpoint                | Access Control | Description                                                       |
| ------ | ----------------------- | -------------- | ----------------------------------------------------------------- |
| GET    | `/children/list`        | adult users    | Returns a list of child accounts associated with logged in parent |
| POST   | `/children/list`        | adult users    | Adds a new child account                                          |
| GET    | `/children/list/:id`    | adult users    | Returns specified child account                                   |
| PUT    | `/children/list/:id`    | adult users    | Updates specified child account                                   |
| DELETE | `/children/list/:id`    | adult users    | Deletes specified child account                                   |
| GET    | `/children/me`          | child users    | Returns logged in child                                           |
| GET    | `/children/preferences` | child users    | Returns child's preferences                                       |
| GET    | `/children/progress`    | child users    | Returns Progress of current week                                  |
| POST   | `/children/progress`    | child users    | Updates progress of current week                                  |
| GET    | `/children/cohort`      | adult users    | Returns cohort the child is in                                    |
| GET    | `/children/parent`      | child users    | Returns the child's parent                                        |
| POST   | `/children/:id/login`   | adult users    | Returns JWT for Child                                             |

#### Canon Routes

| Method | Endpoint       | Access Control | Description            |
| ------ | -------------- | -------------- | ---------------------- |
| GET    | `/canon/`      | admin users    | Returns a list of pdf  |
| GET    | `/canon/:week` | all users      | Returns a matching pdf |
| POST   | `/canon`       | admin users    | Creates a new pdf      |

#### Cohort Routes

| Method | Endpoint            | Access Control | Description                          |
| ------ | ------------------- | -------------- | ------------------------------------ |
| GET    | `/cohort/`          | all users      | Returns Cohort ID of logged in child |
| GET    | `/cohort/list/`     | admin users    | Returns a list of all Cohorts        |
| POST   | `/cohort/list/`     | admin users    | Creates a new Cohort                 |
| PUT    | `/cohort/list/:id/` | admin users    | Updates specified Cohort             |
| DELETE | `/cohort/list/:id/` | admin users    | Deletes specified Cohort             |

#### Payment Routes

| Method | Endpoint     | Access Control | Description                           |
| ------ | ------------ | -------------- | ------------------------------------- |
| GET    | `/cards`     | adult users    | json list of user's cards             |
| POST   | `/cards`     | adult users    | adds card as payment source to Stripe |
| POST   | `/subscribe` | adult users    | creates a subscription                |
| DELETE | `/cards/:id` | adult users    | deletes a payment method              |

#### Submissions Routes

| Method | Endpoint             | Access Control | Description                                                                              |
| ------ | -------------------- | -------------- | ---------------------------------------------------------------------------------------- |
| GET    | `/submissions`       | child users    | json list of user's submissions                                                          |
| GET    | `/submissions/:week` | child users    | json object of a user's submission for a specific week                                   |
| POST   | `/submissions`       | child users    | upload image and receive json object of a user's new submission and the transcribed text |
| DELETE | `/submissions/:week` | child users    | delete and receive json object of a user's removed submission                            |

# Database Entities
/src/database/entity

#### Admin

---

```
{
  id: NUM
  email: STRING
  password: STRING
  temptoken: STRING
  role: STRING
}
```

#### Canon

---

```
{
  week: NUMBER
  base64: STRING
  altbase64: STRING
}
```

#### Child

---

```
{
  id: NUM
  username: STRING
  grade: NUM
  subscription: boolean
  preferences: Preferences { dyslexia: boolean }
  progress: Progress
  parent: ManyToOne(Parent)
  cohort: ManyToOne(Cohort)
  submissions: OneToMany(ARRAY[Submissions])
}
```

#### Cohort

---

```
{
  id: NUMBER
  name: STRING
  week: NUMBER
  activity: STRING
  dueDates: DueDates { reading: Date, writing: Date, submission: Date }
  children: OneToMany(ARRAY[Child])
}
```

#### Parent

---

```
{
  id: NUM
  name: STRING
  children: OneToMany(ARRAY[Child])
  email: STRING
  password: STRING
  stripeID: STRING
}
```


#### Submissions

---

```
{
  id: NUM
  child: ManyToOne(Child)
  week: NUM
  story: Pages{ page1: STRING, page2: STRING, page3: STRING, page4: STRING, page5: STRING }
  storyText: STRING
  illustration: STRING
  
  // readability
  
  flesch_reading_ease: NUM
  smog_index: NUM
  flesch_kincaid_grade: NUM
  coleman_liau_index: NUM
  automated_readability_index: NUM
  dale_chall_readability_score: NUM
  difficult_words: NUM
  linsear_write_formula: NUM
  gunning_fog: NUM
  consolidated_score: STRING
  doc_length: NUM
  quote_count: NUM
  transcribed_text: Pages{ page1: STRING, page2: STRING, page3: STRING, page4: STRING, page5: STRING }
}
```

## Actions

Story Squad uses TypeORM; see their [docs](https://typeorm.io/#/) for available actions.

## Environment Variables

In order for the app to function correctly, the user must set up their own environment variables.
create a .env file that includes the following:
_ PORT=4000
_ SALT=10
_ SECRET_SIGNATURE=Its a secret (example - create your own)
_ STRIPE_API=sk_test_v666XmnGJcP1Oz3GBg2iFmvd004Q3qp4jZ
_ DATABASE_URL=postgresql://postgres:1234@localhost:5432/postgres
_ GOOGLE_APPLICATION_CREDENTIALS='YOUR_GOOGLE_CLOUD_VISION_SERVICE_ACCOUNT_API_INFORMATION'

## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.
Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Issue/Bug Request

**If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**

-   Check first to see if your issue has already been reported.
-   Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
-   Create a live example of the problem.
-   Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes, where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.
Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

-   Ensure any install or build dependencies are removed before the end of the layer when doing a build.
-   Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
-   Ensure that your code conforms to our existing code conventions and test coverage.
-   Include the relevant issue number, if applicable.
-   You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).

## Documentation

See [Frontend Documentation](https://github.com/Lambda-School-Labs/story-squad-fe/blob/master/README.md) for details on the frontend of our project.
