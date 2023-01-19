import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";

import { createUserSession } from "~/services/session.server";
import { validateRequestFormData, validationErrors } from "~/validation.server";
import { createLocalUser, getUserId } from "~/services/auth.server";
import { z } from "zod";
import { safeRedirect } from "~/utils";
import ValidationErrorMessage from "~/components/ValidationErrorMessage";
import UserExistsError from "~/errors/UserExistsError";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/~");
  return json({});
}

const joinSchema = z.object({
  email: z.string().email(),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(8, "Password is too short"),
  redirectTo: z
    .string()
    .optional()
    .transform((val) => safeRedirect(val, "/~")),
});

export async function action({ request }: ActionArgs) {
  const result = await validateRequestFormData(request, joinSchema);

  if (!result.success) {
    return validationErrors(result);
  }

  const { email, password, redirectTo } = result.data;

  try {
    const user = await createLocalUser(email, password);

    return createUserSession({
      request,
      userId: user.id,
      remember: false,
      redirectTo,
    });
  } catch (e) {
    const email =
      e instanceof UserExistsError
        ? "User already exists"
        : "Unknown error occured";
    return json(
      { data: result.data, errors: { email, password: null } },
      { status: 400 }
    );
  }
}

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                ref={emailRef}
                id="email"
                required
                autoFocus={true}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              <ValidationErrorMessage
                id="email-error"
                errors={actionData?.errors?.email}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              <ValidationErrorMessage
                id="password-error"
                errors={actionData?.errors?.password}
              />
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button
            type="submit"
            className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Create Account
          </button>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: "/~/login",
                  search: searchParams.toString(),
                }}
              >
                Log in
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
