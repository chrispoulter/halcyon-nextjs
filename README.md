# Halcyon

A Next.js web project template 👷 Built with a sense of peace and tranquillity 🙏

## Features

- Next.js
  [https://nextjs.org/](https://nextjs.org/)
- Next Safe Action
  [https://next-safe-action.dev/](https://next-safe-action.dev/)
- Shadcn UI
  [https://ui.shadcn.com/](https://ui.shadcn.com/)
- React Hook Form
  [https://react-hook-form.com/](https://react-hook-form.com/)
- Zod
  [https://zod.dev/](https://zod.dev/)
- Tailwind CSS
  [https://tailwindcss.com/](https://tailwindcss.com/)
- Docker
  [https://www.docker.com/](https://www.docker.com/)
- GitHub Actions
  [https://github.com/features/actions](https://github.com/features/actions)

## Getting Started

### Prerequisites

- Halcyon API
  [https://github.com/chrispoulter/halcyon-api](https://github.com/chrispoulter/halcyon-api)

### Install dependencies

Install NPM packages:

```
npm install
```

### Configure environment variables

For local development, you'll need to create a `.env.local` file in the root of the project to define the environment variables. This file is ignored by Git, so the secrets will not be committed to the repository.

```
VERSION=1.0.0-local

API_URL=http://localhost:5257

JWT_SECURITY_KEY=super_secret_key_that_should_be_changed
JWT_ISSUER=HalcyonApi
JWT_AUDIENCE=HalcyonClient

SESSION_SECRET=super_secret_key_that_should_be_changed
```

### Running the development server

Once the dependencies are installed, you can run the development server:

```
npm run dev
```

Open http://localhost:3000 in your browser to see the project running.

## Building for Production

To build the project for production:

```
npm run build
```

This command will create an optimized build in the `.next` folder.

## Linting & Formatting

To lint and format the code:

```
npm run lint
npm run format
```

## Contributing

Feel free to submit issues or pull requests to improve the template. Ensure that you follow the coding standards and test your changes before submission.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
