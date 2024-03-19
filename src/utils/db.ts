import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { Redis } from "ioredis";

export const db = new PrismaClient();

export const redis = new Redis(process.env.REDIS_URL as string);