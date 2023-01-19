import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import type { z } from "zod";
import type { ZodObject, ZodRawShape, ZodType } from "zod";

export type ErrorResult<T> = {
  success: false;
  data: T;
  errors: z.inferFlattenedErrors<ZodType<T>>;
};

export type SuccessResult<T> = {
  success: true;
  data: T;
};

export type Result<T> = SuccessResult<T> | ErrorResult<T>;

export async function validateObject<T extends ZodRawShape>(
  input: Record<string, any>,
  schema: ZodObject<T>,
  errorMap?: z.ZodErrorMap
): Promise<Result<z.infer<typeof schema>>> {
  const data = input as z.infer<typeof schema>;
  const result = await schema.safeParseAsync(data, { errorMap });

  if (!result.success) {
    return {
      success: false,
      data,
      errors: result.error.flatten() as z.inferFlattenedErrors<ZodType<T>>,
    };
  }

  return { success: true, data };
}

export async function validateRequestFormData<T extends ZodRawShape>(
  request: Request,
  schema: ZodObject<T>,
  errorMap?: z.ZodErrorMap
) {
  return await validateFormData(
    await request.clone().formData(),
    schema,
    errorMap
  );
}

export async function validateFormData<T extends ZodRawShape>(
  formData: FormData,
  schema: ZodObject<T>,
  errorMap?: z.ZodErrorMap
) {
  const data = Object.fromEntries(formData.entries());
  return await validateObject(data, schema, errorMap);
}

export async function validateUrlSearchParams<T extends ZodRawShape>(
  urlParams: URLSearchParams,
  schema: ZodObject<T>,
  errorMap?: z.ZodErrorMap
) {
  const data: Record<string, any> = {};
  for (const [key, value] of urlParams.entries()) {
    data[key] = value;
  }
  return await validateObject(data, schema, errorMap);
}

export async function validateUrl<T extends ZodRawShape>(
  request: Request,
  schema: ZodObject<T>,
  errorMap?: z.ZodErrorMap
) {
  return await validateUrlSearchParams(
    new URL(request.url).searchParams,
    schema,
    errorMap
  );
}

export function invariantResult<T>(
  result: Result<T>
): asserts result is SuccessResult<T> {
  invariant(
    result.success,
    !result.success ? JSON.stringify(result.errors) : ""
  );
}

export function isSuccessResult<T>(
  result: Result<T>
): result is SuccessResult<T> {
  return result.success;
}

export function isErrorResult<T>(result: Result<T>): result is ErrorResult<T> {
  return !result.success;
}

export function validationErrors<T>(
  result: ErrorResult<T>,
  status: number = 400
) {
  return json(
    { data: result.data, errors: result.errors.fieldErrors },
    { status }
  );
}
