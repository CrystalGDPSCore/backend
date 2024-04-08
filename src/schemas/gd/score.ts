import { z } from "zod";

export const updateGJUserScoreSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    stars: z.coerce.number().int(),
    moons: z.coerce.number().int(),
    demons: z.coerce.number().int(),
    diamonds: z.coerce.number().int(),
    coins: z.coerce.number().int(),
    userCoins: z.coerce.number().int(),
    color1: z.coerce.number().int(),
    color2: z.coerce.number().int(),
    color3: z.coerce.number().int(),
    iconType: z.coerce.number().int(),
    accIcon: z.coerce.number().int(),
    accShip: z.coerce.number().int(),
    accBall: z.coerce.number().int(),
    accBird: z.coerce.number().int(),
    accDart: z.coerce.number().int(),
    accRobot: z.coerce.number().int(),
    accGlow: z.enum(["0", "1"]).transform(value => value === "1"),
    accSpider: z.coerce.number().int(),
    accExplosion: z.coerce.number().int(),
    accSwing: z.coerce.number().int(),
    accJetpack: z.coerce.number().int(),
    secret: z.string()
});

export type UpdateGJUserScoreInput = z.infer<typeof updateGJUserScoreSchema>;