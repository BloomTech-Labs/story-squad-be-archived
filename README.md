[![Maintainability](https://api.codeclimate.com/v1/badges/027a84a375d801c1cbd9/maintainability)](https://codeclimate.com/github/Lambda-School-Labs/story-squad-be/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/027a84a375d801c1cbd9/test_coverage)](https://codeclimate.com/github/Lambda-School-Labs/story-squad-be/test_coverage)

# API Documentation

#### Backend deployed at [heroku](https://story-squad.herokuapp.com/) <br>

## Getting started

Check the wiki for a [setup guide](https://github.com/Lambda-School-Labs/story-squad-be/wiki/Setup-Guide)

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
  avatar: STRING
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

#### Environment Variables
```
PORT=4000
SALT=10
SECRET_SIGNATURE=Its a secret (example - create your own)
STRIPE_API=sk_test_v666XmnGJcP1Oz3GBg2iFmvd004Q3qp4jZ
DATABASE_URL=postgresql://postgres:1234@localhost:5432/postgres
GOOGLE_APPLICATION_CREDENTIALS='YOUR_GOOGLE_CLOUD_VISION_SERVICE_ACCOUNT_API_INFORMATION'
```

## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.
Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).

## Documentation

See [Frontend Documentation](https://github.com/Lambda-School-Labs/story-squad-fe/blob/master/README.md) for details on the frontend of our project.
