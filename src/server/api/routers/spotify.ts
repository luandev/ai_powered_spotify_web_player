import { createInterface } from "~/server/services/djService";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const tokenInput = z.object({
  token: z.object({
    access_token: z.string(),
    token_type: z.string(),
    expires_in: z.number(),
    refresh_token: z.string(),
    expires_at: z.optional(z.string()),
  })
});

export const spotifyRouter = createTRPCRouter({
  load: publicProcedure
    .input(tokenInput)
    .mutation(async ({ input }) => {
      const userInterface = await createInterface(input.token);
      return userInterface;
    }),
});
