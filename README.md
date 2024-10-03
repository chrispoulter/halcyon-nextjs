# Halcyon

A Next.js web project template with a sense of peace and tranquillity :pray:

## Features

-   Next.js
    [https://nextjs.org/](https://nextjs.org/)
-   TanStack Query
    [https://tanstack.com/query](https://tanstack.com/query)
-   React Hook Form
    [https://react-hook-form.com/](https://react-hook-form.com/)
-   Zod
    [https://zod.dev/](https://zod.dev/)
-   Auth.js
    [https://authjs.dev/](https://authjs.dev/)
-   Tailwind CSS
    [https://tailwindcss.com/](https://tailwindcss.com/)
-   Vitest
    [https://vitest.dev/](https://vitest.dev/)
-   Playwright
    [https://playwright.dev/](https://playwright.dev/)
-   Docker
    [https://www.docker.com/](https://www.docker.com/)
-   GitHub Actions
    [https://github.com/features/actions](https://github.com/features/actions)

## Getting Started

### Prerequisites

-   Halcyon API
    [https://github.com/chrispoulter/halcyon-api](https://github.com/chrispoulter/halcyon-api)

### Install dependencies

Install npm packages:

```
npm install
```

### Apply custom configuration

Create a `.env.local` file in the root project directory:

```
NEXT_PUBLIC_VERSION=1.0.0-local

NEXT_PUBLIC_API_URL=http://localhost:5257

JWT_SECURITY_KEY=super_secret_key_that_should_be_changed
JWT_ISSUER=HalcyonApi
JWT_AUDIENCE=HalcyonClient

AUTH_URL=http://localhost:3000
AUTH_SECRET=super_secret_key_that_should_be_changed
```

### Run the application

```
npm run dev
```

### Access the UI

Once running, you can access the application at http://localhost:3000

## Testing

### Unit testing

To run unit tests:

```
npm run test
```

### End-to-End testing

To run end-to-end tests:

```
npm run playwright:install
npm run playwright:test
```
