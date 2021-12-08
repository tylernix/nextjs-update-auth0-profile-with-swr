# Update An Auth0 User Profile With SWR

> A [Next.js](https://nextjs.org/) project that allows a user to login and edit their [Auth0](https://auth0.com/) profile directly in the application using the [@auth0/nextjs-auth0](https://github.com/auth0/nextjs-auth0) SDK. 

When the user profile is edited and saved, the application does two things:
1. Uses [SWR](https://swr.vercel.app/) (React hooks for data fetching) to cache the user edited values immediately for the endpoint `api/auth/me`. This makes the  "save" seem instant to the user. See `pages/edit.js` and `lib/user-profile.js` for more details.
2. Sends an update request to the [Auth0 Management API](https://auth0.com/docs/api/management/v2) `/api/v2/users/{userid}` endpoint. Since this call takes about one second, this happens asynchronously in the background. See `pages/api/user.js` for more details.

![nextjs-auth0-swr-example](https://user-images.githubusercontent.com/67964959/133476469-1b42b919-996d-4f2b-8ae2-6bc2a4234b1b.gif)

## 🖥️ Live Demo

[https://nextjs-update-auth0-profile-with-swr.vercel.app/](https://nextjs-update-auth0-profile-with-swr.vercel.app/)

## 🚀 Getting Started

### Auth0 Configuration

Create a **Regular Web Application** in the [Auth0 Dashboard](https://manage.auth0.com/#/applications).

> **If you're using an existing application**, verify that you have configured the following settings in your Regular Web Application:
>
> - Click on the "Settings" tab of your application's page.
> - Scroll down and click on the "Show Advanced Settings" link.
> - Under "Advanced Settings", click on the "OAuth" tab.
> - Ensure that "JsonWebToken Signature Algorithm" is set to `RS256` and that "OIDC Conformant" is enabled.

Next, configure the following URLs for your application under the "Application URIs" section of the "Settings" page:

- **Allowed Callback URLs**: `http://localhost:3000/api/auth/callback`
- **Allowed Logout URLs**: `http://localhost:3000/`

Take note of the **Client ID**, **Client Secret**, and **Domain** values under the "Basic Information" section. You'll need these values in the next step.

### Basic Setup

You need to allow your Next.js application to communicate properly with Auth0. You can do so by creating a `.env.local` file under your root project directory that defines the necessary Auth0 configuration values as follows:

```bash
# A long, secret value used to encrypt the session cookie
AUTH0_SECRET='LONG_RANDOM_VALUE'
# The base url of your application
AUTH0_BASE_URL='http://localhost:3000'
# The url of your Auth0 tenant domain
AUTH0_ISSUER_BASE_URL='https://YOUR_AUTH0_DOMAIN.auth0.com'
# Your Auth0 application's Client ID
AUTH0_CLIENT_ID='YOUR_AUTH0_CLIENT_ID'
# Your Auth0 application's Client Secret
AUTH0_CLIENT_SECRET='YOUR_AUTH0_CLIENT_SECRET'
```

You can execute the following command to generate a suitable string for the `AUTH0_SECRET` value:

```bash
node -e "console.log(crypto.randomBytes(32).toString('hex'))"
```
### Start Local Application 

Start by installing the dependencies of this project:

```bash
npm install
# or 
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js` or `pages/edit.js` or `pages/api/user.js`. The pages auto-update as you edit the files.

## 🔎 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

To learn more about Auth0, take a look at the following resources:

- [Auth0 Next.js SDK](https://github.com/auth0/nextjs-auth0)
- [The Ultimate Guide to Next.js Authentication with Auth0](https://auth0.com/blog/ultimate-guide-nextjs-authentication-auth0/)
- [Auth0 User Profile Structure](https://auth0.com/docs/users/user-profiles/user-profile-structure)
- [Get Management API Access Tokens For Production](https://auth0.com/docs/security/tokens/access-tokens/get-management-api-access-tokens-for-production)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).
