import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import { z } from "zod";

import { requireUserId } from "~/services/auth.server";
import { getNote, deleteNote } from "~/services/notes.server";
import {
  invariantResult,
  validateObject,
  validationErrors,
} from "~/validation.server";

const getNoteSchema = z.object({
  noteId: z
    .string({ required_error: "noteId is required" })
    .cuid("Note not found"),
});

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);

  const result = await validateObject(params, getNoteSchema);

  invariantResult(result);

  const { noteId: id } = result.data;

  const note = await getNote({ id, userId });
  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ note });
}

const deleteNoteSchema = z.object({
  noteId: z
    .string({ required_error: "noteId is required" })
    .cuid("Note not found"),
});

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);

  var result = await validateObject(params, deleteNoteSchema);
  if (!result.success) {
    return validationErrors(result);
  }

  const { noteId: id } = result.data;

  await deleteNote({ id, userId });

  return redirect("/~/notes");
}

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.note.title}</h3>
      <p className="py-6">{data.note.body}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
