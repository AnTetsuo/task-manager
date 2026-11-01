import { createTRPCClient, httpBatchLink } from "@trpc/client";

import type { AppRouter } from "../../../backend/src/router";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787"}/trpc`,
    }),
  ],
});
