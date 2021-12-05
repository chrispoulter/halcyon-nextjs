# Halcyon

A web application template.

**Technologies used:**

-   React
    [https://reactjs.org](https://reactjs.org)
-   Express
    [https://expressjs.com/](https://expressjs.com/)
-   PostgreSQL
    [https://www.postgresql.org/](https://www.postgresql.org/)

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
