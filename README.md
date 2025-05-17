This is a [Next.js](https://nextjs.org/) project for a book store application with secure authentication.

## Getting Started

### Environment Setup

1. Copy the `.env.local.example` file to `.env.local`:

```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your actual values:
   - `GOOGLE_BOOKS_API_KEY`: Your Google Books API key
   - `JWT_SECRET`: A secure random string for JWT token signing

### Install Dependencies

Install the required dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

You'll need to install these additional packages for authentication:

```bash
npm install jsonwebtoken bcryptjs
# or
yarn add jsonwebtoken bcryptjs
# or
pnpm add jsonwebtoken bcryptjs
```

### Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication System

This application implements a secure authentication system with the following features:

- JWT (JSON Web Token) based authentication
- Secure password hashing with bcrypt
- Protected API routes
- Protected pages (profile)
- Secure credential storage

### How Authentication Works

1. Users log in with email and password
2. Credentials are verified against securely stored hashed passwords
3. Upon successful authentication, a JWT token is generated and stored in Redux
4. Protected routes and pages check for this token
5. API requests include the token in the Authorization header

### Default Test User

For testing purposes, you can use the following credentials:
- Email: shomakhov@skillfactory.ru
- Password: Zaurskillfactory

### API Routes

The application includes the following API routes:

- `/api/auth` - Authentication endpoint (POST for login, GET for user info)
- `/api/books` - Protected endpoint for fetching books from Google Books API

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
