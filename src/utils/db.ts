import { PrismaClient } from "@prisma/client";
import { Redis } from "ioredis";

import { redisDb } from "../config.json";

export const db = new PrismaClient();
export const redis = new Redis(`rediss://default:${redisDb.password}@${redisDb.host}:${redisDb.port}`);