import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { Redis } from "ioredis";

declare global {
    namespace PrismaJson {
        type FriendsInfo = {
            id: number,
            isNew: boolean
        };
    }
}

export const db = new PrismaClient();

export const redis = new Redis(process.env.REDIS_URL!);