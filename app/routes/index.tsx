// app/routes/index.tsx
import * as fs from "fs";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import {
  SignedIn,
  UserButton,
  SignOutButton,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/tanstack-start";

const filePath = "count.txt";

async function readCount() {
  return parseInt(
    await fs.promises.readFile(filePath, "utf-8").catch(() => "0")
  );
}

const getCount = createServerFn("GET", () => {
  return readCount();
});

const updateCount = createServerFn("POST", async (addBy: number) => {
  const count = await readCount();
  await fs.promises.writeFile(filePath, `${count + addBy}`);
});

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => await getCount(),
});

function Home() {
  const router = useRouter();
  const state = Route.useLoaderData();

  return (
    <>
      Hello World
      <SignedIn>
        <p>You are signed In</p>
        <UserButton />
        <SignOutButton />
        <button
          onClick={() => {
            updateCount(1).then(() => {
              router.invalidate();
            });
          }}
        >
          Add 1 to {state}?
        </button>
      </SignedIn>
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
    </>
  );
}
