import NextAuth from "next-auth";
import { authOptions } from "./options";

const handler = NextAuth(authOptions);

export {handler as GET , handler as POST};


// summary for the next-auth , in the api folder we need to create a folder called auth inside it we need to create [...nextauth] a square bracket and ... folder and we need to create two files options.ts and route.ts in options.ts we write the logic for oauth providders or the custom login logic and callbacks and we export it , in the create a handler and using NextAuth(authOptions) methods export this handler as GET , and as POST

