# Halcyon

A web application template.

**Technologies used:**

-   React
    [https://reactjs.org](https://reactjs.org)
-   Apollo GraphQL
    [https://www.apollographql.com](https://www.apollographql.com)
-   DynamoDB
    [https://aws.amazon.com/dynamodb](https://aws.amazon.com/dynamodb)

#### Custom Settings

Create a `.env` file in the web project directory.

```
## Api #############################################

JWT_SECURITYKEY=change-me-1234567890
JWT_ISSUER=HalcyonApi
JWT_AUDIENCE=HalcyonClient
JWT_EXPIRESIN=3600

MAILGUN_DOMAIN=
MAILGUN_APIKEY=
MAILGUN_NOREPLY=noreply@chrispoulter.com

SEED_EMAILADDRESS=
SEED_PASSWORD=

## Front End #######################################

REACT_APP_GA_MEASUREMENTID=
```
