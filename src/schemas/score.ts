import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

// Web Schemas

export const updateUserScoreSchema = z.object({
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

export type updateUserScoreInput = z.infer<typeof updateUserScoreSchema>;

// GD Schemas

export const updateGJUserScoreSchema = z.object({
    accountID: z.string(),
    gjp2: z.string(),
    stars: z.string(),
    moons: z.string(),
    demons: z.string(),
    diamonds: z.string(),
    color1: z.string(),
    color2: z.string(),
    color3: z.string(),
    iconType: z.string(),
    coins: z.string(),
    userCoins: z.string(),
    accIcon: z.string(),
    accShip: z.string(),
    accBall: z.string(),
    accBird: z.string(),
    accDart: z.string(),
    accRobot: z.string(),
    accGlow: z.string(),
    accSpider: z.string(),
    accExplosion: z.string(),
    accSwing: z.string(),
    accJetpack: z.string(),
    secret: z.string()
});

export type updateGJUserScoreInput = z.infer<typeof updateGJUserScoreSchema>;

export const { schemas: scoreSchemas, $ref: $scoreRef } = buildJsonSchemas({
    
}, { $id: "scoreSchema" });