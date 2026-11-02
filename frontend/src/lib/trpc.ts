import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../../backend/src/router";
import { inferRouterOutputs } from "@trpc/server";

export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type Task = RouterOutputs["tasks"]["update"];

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787"}/trpc`,
    }),
  ],
});
