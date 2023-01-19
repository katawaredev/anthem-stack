import { Authenticator } from "remix-auth";
// import {
// 	GoogleStrategy,
// 	FacebookStrategy,
// 	SocialsProvider,
// } from 'remix-auth-socials'
import { FormStrategy } from "remix-auth-form";
import invariant from "tiny-invariant";
import { sessionStorage } from "./session.server";
import {
  createUser,
  getUserByEmail,
  getUserById,
  verifyLogin,
} from "~/models/user.server";
import UserExistsError from "~/errors/UserExistsError";

export const authenticator = new Authenticator<string>(sessionStorage, {
  sessionKey: "token",
});

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email");
    const password = form.get("password");

    invariant(typeof email === "string", "email must be a string");
    invariant(email.length > 0, "email must not be empty");

    invariant(typeof password === "string", "password must be a string");
    invariant(password.length > 0, "password must not be empty");

    const user = await verifyLogin(email, password);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    return user.id;
  }),
  FormStrategy.name
);

export async function requireUserId(request: Request) {
  const requestUrl = new URL(request.url);
  const loginParams = new URLSearchParams([
    ["redirectTo", `${requestUrl.pathname}${requestUrl.search}`],
  ]);
  const failureRedirect = `/login?${loginParams}`;
  const userId = await authenticator.isAuthenticated(request, {
    failureRedirect,
  });
  return userId;
}

export function getUserId(request: Request) {
  return authenticator.isAuthenticated(request);
}

export async function getUser(request: Request) {
  const userId = await authenticator.isAuthenticated(request);

  let user: Awaited<ReturnType<typeof getUserById>> | null = null;
  if (userId) {
    user = await getUserById(userId);
    if (!user) {
      // something weird happened... The user is authenticated but we can't find
      // them in the database. Maybe they were deleted? Let's log them out.
      await authenticator.logout(request, { redirectTo: "/" });
    }
  }

  return user;
}

export const createLocalUser = async (email: string, password: string) => {
  if (!(await isUserEmailUnique(email)))
    throw new UserExistsError(`A user already exists with email \`${email}\``);
  return createUser(email, password);
};

export async function isUserEmailUnique(email: string) {
  const existingUser = await getUserByEmail(email);
  return !existingUser;
}

export function getUserSessionKey() {
  return authenticator.sessionKey;
}

export function loginByLocalRequest(request: Request) {
  return authenticator.authenticate(FormStrategy.name, request.clone(), {
    failureRedirect: "/~/login",
  });
}

export function logout(request: Request, redirectTo = "/~") {
  return authenticator.logout(request, { redirectTo });
}

// authenticator.use(
// 	new GoogleStrategy(
// 		{
// 			clientID: 'YOUR_CLIENT_ID',
// 			clientSecret: 'YOUR_CLIENT_SECRET',
// 			callbackURL: `http://localhost:3333/auth/${SocialsProvider.GOOGLE}/callback`,
// 		},
// 		async ({ profile }) => {
// 			// here you would find or create a user in your database
// 			return profile
// 		},
// 	),
// )

// authenticator.use(
// 	new FacebookStrategy(
// 		{
// 			clientID: 'YOUR_CLIENT_ID',
// 			clientSecret: 'YOUR_CLIENT_SECRET',
// 			callbackURL: `https://localhost:3333/auth/${SocialsProvider.FACEBOOK}/callback`,
// 		},
// 		async ({ profile }) => {
// 			// here you would find or create a user in your database
// 			return profile
// 		},
// 	),
// )
