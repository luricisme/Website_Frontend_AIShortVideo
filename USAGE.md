This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# React 19 Dependency Resolution Guide

## Error When Installing Incompatible Packages

If you are installing a package that **does not** list React 19 as a peer dependency, you will see an error message like this:

```
npm error code ERESOLVE
npm error ERESOLVE unable to resolve dependency tree
npm error
npm error While resolving: my-app@0.1.0
npm error Found: react@19.0.0-rc-69d4b800-20241021
npm error node_modules/react
npm error   react@"19.0.0-rc-69d4b800-20241021" from the root project
```

**Note:** This is npm only. PNPM and Bun will only show a silent warning.

## How to Fix This

### Solution 1: `--force` or `--legacy-peer-deps`

You can force install a package with the `--force` or the `--legacy-peer-deps` flag:

```bash
npm i <package> --force
npm i <package> --legacy-peer-deps
```

This will install the package and ignore the peer dependency warnings.

#### What do the `--force` and `--legacy-peer-deps` flags do?

-   `--force`: Overwrites existing dependencies and installs the package regardless of conflicts.
-   `--legacy-peer-deps`: Uses the pre-npm 7 behavior for peer dependency resolution (less strict).

**Recommendation**: Prefer using `--legacy-peer-deps` as it generally provides a more stable solution with fewer side effects compared to `--force`.

### Solution 2: Use React 18

You can downgrade `react` and `react-dom` to version 18, which is compatible with the package you are installing and upgrade when the dependency is updated:

```bash
npm i react@18 react-dom@18
```

Whichever solution you choose, make sure you test your app thoroughly to ensure there are no regressions.

## Using shadcn/ui on Next.js 15

### Using pnpm, bun, or yarn

Follow the instructions in the **installation guide** to install shadcn/ui. No flags are needed.

### Using npm

When you run `npx shadcn@latest init -d`, you will be prompted to select an option to resolve the peer dependency issues:

```
It looks like you are using React 19.
Some packages may fail to install due to peer dependency issues (see https://ui.shadcn.com/react-19).
? How would you like to proceed? › - Use arrow-keys. Return to submit.
❯   Use --force
    Use --legacy-peer-deps
```

For most cases, it's recommended to select the `--legacy-peer-deps` option as it tends to be more reliable.

You can then run the command with the flag you choose.
