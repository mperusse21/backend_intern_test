import { PrismaClient } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Context = {
  prisma: PrismaClient;
};
