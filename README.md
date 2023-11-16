# Halcyon Next.js

A web application template.

**Technologies used:**

-   React
    [https://reactjs.org/](https://reactjs.org/)
-   Next.js
    [https://nextjs.org/](https://nextjs.org/)
-   PostgreSQL
    [https://www.postgresql.org/](https://www.postgresql.org/)

#### Custom Settings

Create a `.env` file in the web project directory.

```
DATABASE_URL=postgres://postgres:password@localhost/halcyon

EMAIL_SMTP_SERVER=localhost
EMAIL_SMTP_PORT=1025
EMAIL_SMTP_USERNAME=
EMAIL_SMTP_PASSWORD=
EMAIL_NO_REPLY_ADDRESS=noreply@example.com

SEED_EMAIL_ADDRESS=system.administrator@example.com
SEED_PASSWORD=change-me-1234567890

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=YenEZqADi2YnfVCNWMFkcUpmr55ESFepmHgH3NSmPoBeSqf9Hs3Ui8vb6xdkCY9PNewqNxVQdjkqhCGaWeyri48FyDPU9HfKFjbHcfbyq4Fuqmk2suehduYJYzuPoSD8
NEXTAUTH_SESSION_MAXAGE=3600
```
