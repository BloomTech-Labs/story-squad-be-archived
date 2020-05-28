[![Maintainability](https://api.codeclimate.com/v1/badges/027a84a375d801c1cbd9/maintainability)](https://codeclimate.com/github/Lambda-School-Labs/story-squad-be/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/027a84a375d801c1cbd9/test_coverage)](https://codeclimate.com/github/Lambda-School-Labs/story-squad-be/test_coverage)

# API Documentation

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

[Postman Documentation](https://documenter.getpostman.com/view/9969236/SzS1UpP9?version=latest)

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

#### Versus Routes

| Method | Endpoint               | Access Control | Description                   |
| ------ | ---------------------- | -------------- | ----------------------------- |
| GET    | `/versusRoutes/versus` | child          | Gets a childs full match data |

#### Voting Routes

| Method | Endpoint               | Access Control | Description                    |
| ------ | ---------------------- | -------------- | ------------------------------ |
| GET    | `/votingRoutes/voting` | child          | Gets a random match to vote on |
| POST   | `/votingRoutes/voting` | child          | Submits a vote                 |

## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.
Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).

## Documentation

See [Frontend Documentation](https://github.com/Lambda-School-Labs/story-squad-fe/blob/master/README.md) for details on the frontend of our project.

For information on database entities and environment variables, see the [backend documentation](https://github.com/Lambda-School-Labs/story-squad-be/wiki).
