import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";

//Authentication provider festlegen -> Anmeldung über google, facebook etc
// Siehe nach github.com/settings/applications/new
//authorization callnack URL = http://localhost:3000/api/auth/callback/github
//man braucht ne privacy policy
export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    process.env.EMAIL_FROM
      ? EmailProvider({
          from: process.env.EMAIL_FROM,
          server: {
            auth: {
              pass: process.env.EMAIL_SERVER_PASSWORD,
              user: process.env.EMAIL_SERVER_USER,
            },
            host: process.env.EMAIL_SERVER_HOST,
            port: process.env.EMAIL_SERVER_PORT,
          },
        })
      : false,
    process.env.GITHUB_ID
      ? GithubProvider({
          clientId: process.env.GITHUB_ID, //Generische Konfiguration
          clientSecret: process.env.GITHUB_SECRET,
        })
      : false,
    process.env.FACEBOOK_ID
      ? FacebookProvider({
          clientId: process.env.FACEBOOK_ID,
          clientSecret: process.env.FACEBOOK_SECRET,
        })
      : false,
    process.env.GOOGLE_ID
      ? GoogleProvider({
          clientId: process.env.GOOGLE_ID,
          clientSecret: process.env.GOOGLE_SECRET,
        })
      : false,
    process.env.ALLOW_DEBUG_SIGN_IN
      ? CredentialsProvider({
          name: "Debug Account",
          async authorize(credentials, req) {
            return {
              isDebugAccount: true,
              name: "Debug Account",
              email: "",
              image:
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kTtIw0Acxr+2an1UHOwg4pChOtnFF461CkWoEGqFVh1MLn1Bk4YkxcVRcC04+FisOrg46+rgKgiCDxBXFydFFynxf0mhRYwHx/347r6Pu+8Af73MVLMjBqiaZaQScSGTXRWCr+hCD/owjaDETH1OFJPwHF/38PH1LsqzvM/9OfqVnMkAn0AcY7phEW8Qz2xaOud94jArSgrxOfG4QRckfuS67PIb54LDfp4ZNtKpeeIwsVBoY7mNWdFQiaeII4qqUb4/47LCeYuzWq6y5j35C0M5bWWZ6zRHkMAiliBCgIwqSijDQpRWjRQTKdqPe/iHHb9ILplcJTByLKACFZLjB/+D392a+ckJNykUBzpfbPtjFAjuAo2abX8f23bjBAg8A1day1+pA7OfpNdaWuQIGNgGLq5bmrwHXO4AQ0+6ZEiOFKDpz+eB9zP6piwweAv0rrm9Nfdx+gCkqavkDXBwCIwVKHvd493d7b39e6bZ3w9yHnKmxf2ugAAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+cGCQs1IzneZ5UAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAADRklEQVRo3u2aaZOaQBCGYdCVQ7xYr+i6m02ylVT+/59JbdZbQRSQGwQmH6xKpVIeyIzCJrwfLeyZh+me6e6BnC2WxHsWIN65coAcIAfIAXKAHCAH+HcBSJIkSfKqQxSwWwyCYKOqum4alhkE4f7HMsdVK3y9VmUZBvM7wpiNhmE4X0qSLEMIjz1T5fnBQ4+h6cwBWLb9+jbyfD+GXxEPvV6n1cyQC+mG8ePnMIqiOA9DSExmc9/3B/1eJoLYsu34s/8tcSUvRCl9gCiKXofjS2e/12yxNEwzZYCFKHmel/jvo8nsRMRfHSAIAnElo1hwXFdRtdQA1oqazHn+lCSvUwNQNQ09Ck3L2u12KQBEUWSYFpZdGMVOcgAXIXb/ku04KQB4no8LACWQkgOEUYgLAGUnTQ5QoLBlsigpd3KA0t0dLgCKolIAoOkSLgCUIgGgrHuV57EAlMtcOgdZvVZFn32F54uFQjoAQqOO4r57tZtCaqkERVHddgvFAscy9VotzXS602qiFLgfB4OU6wEAwJfnJwCS2HkaPLAskzIAQRA0TX97+XwpQ6/Tbt0L6KPjaWxxLPv960tMX6IA+PT02PvQzVZbZZ+TSfJ6KUpBeDRNuhcavW4H4ylOYr9mjaJI03VN0x3XtWwbQsjQNEOXeL7cqNfvikW8w+FvLQIAyizLlGhIwDAMISQKFEUCkiRJ7LPHBmA7jmGalu3YjmPbp6oThqZZhuZYtsxxKBkEHhcyTWujqoqq7YIg2TlYr1aERqNa4W8KEEGoKOpSWjmui2UB74rFTrvVFASKAlcH2CjqdLHw/R1+b6ao/odu8164qL65AMDz/OF4oiM3A8/VBvTz42P8EzougKJpw9EkRG5jxdSgH7f/HmsXmi/F+VIkbqjJbO553qDfO+tOII6tG89+L0lev43GZ9sVZwBW8hqxfYuijapNZ/PkAKZljaYzIlWJK1k52YEFJ1Ka4XhCZEDD8TQ4flAeBZA3iuN6WQAIw3B+/DLqMACEcJFG4J4IxWOLcBhgqxvJ0psrCUK4VtQLALTtlsiYtrp+AYBpWdkDMC4AsB2XyJ7cQ5vK4Vzo2p+YJI6EuLkQ4t3tLZV/8JQD/O8AvwAwpJATLsqGSgAAAABJRU5ErkJggg==",
            };
          },
        })
      : false,
  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // Persist the user id to the token right after signin
      if (account) {
        // Construct unique account identifier from provider and user id.
        // This is what we use in our database to identify user accounts.
        token.account = {
          provider: account.provider,
          providerAccountId: user.isDebugAccount
            ? "debug"
            : account.providerAccountId,
        };
      }

      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like a user id from a provider.
      // session.account = token?.account || user;

      return session;
    },
  },
};

export default NextAuth(authOptions);
