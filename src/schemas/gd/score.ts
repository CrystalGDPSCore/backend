import { z } from "zod";

export const updateGJUserScoreSchema = z.object({
    accountID: z.coerce.number(),
    gjp2: z.string(),
    stars: z.coerce.number(),
    moons: z.coerce.number(),
    demons: z.coerce.number(),
    diamonds: z.coerce.number(),
    coins: z.coerce.number(),
    userCoins: z.coerce.number(),
    color1: z.coerce.number(),
    color2: z.coerce.number(),
    color3: z.coerce.number(),
    iconType: z.coerce.number(),
    accIcon: z.coerce.number(),
    accShip: z.coerce.number(),
    accBall: z.coerce.number(),
    accBird: z.coerce.number(),
    accDart: z.coerce.number(),
    accRobot: z.coerce.number(),
    accGlow: z.coerce.number(),
    accSpider: z.coerce.number(),
    accExplosion: z.coerce.number(),
    accSwing: z.coerce.number(),
    accJetpack: z.coerce.number(),
    secret: z.string()
});

export type UpdateGJUserScoreInput = z.infer<typeof updateGJUserScoreSchema>;