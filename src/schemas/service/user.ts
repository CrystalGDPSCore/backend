import { z } from "zod";

const createUserSchema = z.object({
    userName: z.string().regex(/^[0-9a-zA-Z]{3,15}$/),
    hashPassword: z.string().regex(/^\$2(a|b|x|y)\$[0-9]{1,2}\$[a-zA-Z.0-9\/+]{22}={0,2}[A-Za-z0-9+\/.+]{31}={0,2}$/),
    email: z.string().email()
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

const updateUserAccessSchema = z.object({
    modRequested: z.boolean(),
    commentColor: z.string().regex(/^#[A-Fa-f0-9]{6}$/)
});

export type UpdateUserAccessInput = z.infer<typeof updateUserAccessSchema>;

const updateUserSettingsSchema = z.object({
    messageState: z.enum(["All", "Friends", "None"]),
    friendRequestState: z.enum(["All", "None"]), 
    commentHistoryState: z.enum(["All", "Friends", "None"]),
    youtube: z.string().regex(/^[0-9a-zA-Z-_]+$/),
    twitter: z.string().regex(/^[0-9a-zA-Z-_]+$/),
    twitch: z.string().regex(/^[0-9a-zA-Z-_]+$/)
});

export type UpdateUserSettingsInput = z.infer<typeof updateUserSettingsSchema>;

const updateUserScoreSchema = z.object({
    stars: z.number().int(),
    moons: z.number().int(),
    secretCoins: z.number().int(),
    userCoins: z.number().int(),
    demons: z.number().int(),
    diamonds: z.number().int(),
    iconType: z.number().int(),
    iconCube: z.number().int(),
    iconShip: z.number().int(),
    iconBall: z.number().int(),
    iconUfo: z.number().int(),
    iconWave: z.number().int(),
    iconRobot: z.number().int(),
    iconSpider: z.number().int(),
    iconSwing: z.number().int(),
    iconJetpack: z.number().int(),
    iconExplosion: z.number().int(),
    primaryColor: z.number().int(),
    secondaryColor: z.number().int(),
    glowColor: z.number().int(),
    hasGlow: z.boolean()
});

export type UpdateUserScoreInput = z.infer<typeof updateUserScoreSchema>;