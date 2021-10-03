# Halcyon

A web application template.

**Technologies used:**

-   React
    [https://reactjs.org](https://reactjs.org)
-   Apollo GraphQL
    [https://www.apollographql.com](https://www.apollographql.com)
-   Serverless
    [https://www.serverless.com](https://www.serverless.com)
-   DynamoDB
    [https://aws.amazon.com/dynamodb](https://aws.amazon.com/dynamodb)
-   SNS
    [https://aws.amazon.com/sns](https://aws.amazon.com/sns)

#### Custom Settings

Create a `.env` file in the web project directory.

```
## Api #############################################

JWT_SECURITY_KEY=change-me-1234567890
JWT_ISSUER=HalcyonApi
JWT_AUDIENCE=HalcyonClient
JWT_EXPIRES_IN=3600

MAILGUN_DOMAIN=
MAILGUN_API_KEY=
MAILGUN_NO_REPLY=noreply@chrispoulter.com

SEED_EMAIL_ADDRESS=
SEED_PASSWORD=

## Front End #######################################

REACT_APP_GA_MEASUREMENT_ID=
```
