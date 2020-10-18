# Halcyon GraphQL

A web application template.

[https://halcyon-graphql.chrispoulter.com](https://halcyon-graphql.chrispoulter.com)

**Technologies used:**

-   React
    [https://reactjs.org](https://reactjs.org)
-   Apollo GraphQL
    [https://www.apollographql.com](https://www.apollographql.com)
-   FaunaDB
    [https://fauna.com](https://fauna.com)

#### Custom Settings

Create a `.env` file in `the packages/api` directory.

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

Create a `.env` file in the `packages/client` directory.

```
REACT_APP_GRAPHQL_URL=
```
