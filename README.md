# Halcyon GraphQL

A Node.js GraphQL project template.

[https://halcyon-graphql.chrispoulter.com](https://halcyon-graphql.chrispoulter.com)

**Technologies used:**

-   Node.js
    [https://nodejs.org](https://nodejs.org)
-   Apollo Server
    [https://www.apollographql.com](https://www.apollographql.com)
-   FaunaDB
    [https://fauna.com](https://fauna.com)

#### Custom Settings

Create `.env` file in root directory.

```
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
```
