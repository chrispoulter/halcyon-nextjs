# Halcyon

A web application template.

**Technologies used:**

-   React
    [https://reactjs.org](https://reactjs.org)
-   Apollo GraphQL
    [https://www.apollographql.com](https://www.apollographql.com)
-   FaunaDB
    [https://fauna.com](https://fauna.com)

#### Custom Settings

Create a `.env` file in the web project directory.

```
## Api #############################################

ENVIRONMENT=dev
RELEASE=dev

FAUNADB_SECRET=

JWT_SECURITYKEY=change-me-1234567890
JWT_ISSUER=HalcyonApi
JWT_AUDIENCE=HalcyonClient
JWT_EXPIRESIN=3600

MAILGUN_DOMAIN=
MAILGUN_APIKEY=
MAILGUN_NOREPLY=noreply@chrispoulter.com

SEED_EMAILADDRESS=
SEED_PASSWORD=

SENTRY_DSN=

## Front End #######################################

REACT_APP_ENVIRONMENT=dev
REACT_APP_RELEASE=dev

REACT_APP_SENTRY_DSN=
REACT_APP_GA_MEASUREMENTID=

REACT_APP_GRAPHQL_URL=
```
