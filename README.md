<<<<<<< HEAD
=======

>>>>>>> 9e47aaa0d9a94adc17fa0104cea5b7938609db76
# realtime-messenger-app
 Building a full stack realtime chat app with NextJS 13.  Using Upstash Redis as our database, React for the user interface, and write our code in TypeScript. By the end of the video, a super-performant realtime chat app deployed to the web, ready to be used by actual users. 
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).



---

## Project Development Tech used:
---
- Next JS 13 + Typescript as language.
- Tailwind Css (CSS Framework)
- __lucide-react__ (Icon Dependency)
---
## Create Reusable Button Component 
####    *If we want to create a reusable button variance where we can define different varients for any component like button here and that button can be act as outline 
button, destructive button, Default button*
1. Install class-variance-authority

---
####    *To pass className as props to any react component we create a utility function that takes ClassValue[] as input props type and to make this utility function we need to install 2 libraries:*
 
 ### 1. __clsx__ For Conditional class names.
 ### 2. __tailwind-merge__ To merge tailwind classes together. (optimize the tailwind code)



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

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
