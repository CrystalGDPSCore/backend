import { SuggestDifficulty } from "@prisma/client";

import { z } from "zod";

export const uploadGJLevelSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    levelID: z.coerce.number().int(),
    levelName: z.string(),
    levelDesc: z.string(),
    levelVersion: z.coerce.number().int(),
    levelLength: z.enum(["0", "1", "2", "3", "4", "5"]).transform(value => {
        switch (value) {
            case "0":
                return "Tiny";
            case "1":
                return "Short";
            case "2":
                return "Medium";
            case "3":
                return "Long";
            case "4":
                return "XL";
            case "5":
                return "Platformer";
        }
    }),
    audioTrack: z.coerce.number().int(),
    original: z.coerce.number().int(),
    twoPlayer: z.enum(["0", "1"]).transform(value => value == "1"),
    songID: z.coerce.number().int(),
    objects: z.coerce.number().int(),
    coins: z.coerce.number().int(),
    requestedStars: z.coerce.number().int(),
    unlisted: z.enum(["0", "1", "2"]).transform(value => {
        switch (value) {
            case "0":
                return "Listed";
            case "1":
                return "FriendsOnly";
            case "2":
                return "Unlisted";
        }
    }),
    ldm: z.enum(["0", "1"]).transform(value => value == "1"),
    songIDs: z.string().transform(value => value.split(",").map(songId => parseInt(songId))).catch([]),
    sfxIDs: z.string().transform(value => value.split(",").map(sfxId => parseInt(sfxId))).catch([]),
    levelString: z.string(),
    secret: z.string()
});

export type UploadGJLevelInput = z.infer<typeof uploadGJLevelSchema>;

export const getGJLevelsSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    type: z.enum(["0", "1", "2", "3", "4", "5", "6", "7", "10", "11", "12", "13", "21", "22", "23", "25", "27"]).transform(value => {
        switch (value) {
            case "0":
                return "Search";
            case "1":
                return "Downloads";
            case "2":
                return "Likes";
            case "3":
                return "Trending";
            case "4":
                return "Recent";
            case "5":
                return "UserLevels";
            case "6":
                return "Featured";
            case "7":
                return "Magic";
            case "10":
                return "MapPacks";
            case "11":
                return "Awarded";
            case "12":
                return "Followed";
            case "13":
                return "Friends";
            case "21":
                return "DailySafe";
            case "22":
                return "WeeklySafe";
            case "23":
                return "EventSafe";
            case "25":
                return "LevelList";
            case "27":
                return "Sent";
        }
    }).catch("Search"),
    str: z.string().transform(value => {
        if (value.includes(",")) {
            const levelIds = value.split(",").map(levelId => parseInt(levelId));

            return levelIds;
        }

        if (isNaN(parseInt(value))) {
            return value;
        }

        return parseInt(value);
    }).catch(-1),
    diff: z.array(z.string()).transform(value => {
        const difficulties = value[0].split(",").map(levelDifficulty => {
            switch (levelDifficulty) {
                case "-1":
                    return "NA";
                case "-2":
                    return "Demon";
                case "-3":
                    return "Auto";
                case "1":
                    return "Easy";
                case "2":
                    return "Normal";
                case "3":
                    return "Hard";
                case "4":
                    return "Harder";
                case "5":
                    return "Insane";
                default:
                    return "NotSelected";
            }
        });

        return difficulties;
    }).catch(["NotSelected"]),
    len: z.string().transform(value => {
        const lengths = value.split(",").map(levelLength => {
            switch (levelLength) {
                case "0":
                    return "Tiny";
                case "1":
                    return "Short";
                case "2":
                    return "Medium";
                case "3":
                    return "Long";
                case "4":
                    return "XL";
                case "5":
                    return "Platformer";
                default:
                    return "NotSelected";
            }
        });

        return lengths;
    }).catch(["NotSelected"]),
    page: z.coerce.number().int().catch(-1),
    uncompleted: z.enum(["0", "1"]).transform(value => value == "1").catch(false),
    onlyCompleted: z.enum(["0", "1"]).transform(value => value == "1").catch(false),
    completedLevels: z.string().transform(value => {
        const levelIds = value.slice(1, -1).split(",").map(levelId => parseInt(levelId));

        return levelIds;
    }).catch([]),
    featured: z.enum(["0", "1"]).transform(value => value == "1").catch(false),
    original: z.enum(["0", "1"]).transform(value => value == "1").catch(false),
    twoPlayer: z.enum(["0", "1"]).transform(value => value == "1").catch(false),
    coins: z.enum(["0", "1"]).transform(value => value == "1").catch(false),
    song: z.coerce.number().int().catch(-1),
    customSong: z.coerce.boolean().catch(false),
    noStar: z.coerce.boolean().catch(false),
    star: z.coerce.boolean().catch(false),
    epic: z.coerce.boolean().catch(false),
    mythic: z.coerce.boolean().catch(false),
    legendary: z.coerce.boolean().catch(false),
    demonFilter: z.enum(["1", "2", "3", "4", "5"]).transform(value => {
        switch (value) {
            case "1":
                return "EasyDemon";
            case "2":
                return "MediumDemon";
            case "3":
                return "HardDemon";
            case "4":
                return "InsaneDemon";
            case "5":
                return "ExtremeDemon";
            default:
                return "NotSelected";
        }
    }).catch("NotSelected"),
    followed: z.string().transform(value => {
        if (!value) {
            return [];
        }

        const userIds = value.split(",").map(userId => parseInt(userId));

        return userIds;
    }).catch([]),
    gauntlet: z.coerce.number().int().catch(-1),
    secret: z.string()
});

export type GetGJLevelsInput = z.infer<typeof getGJLevelsSchema>;

export const downloadGJLevelSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    levelID: z.coerce.number().int(),
    secret: z.string()
});

export type DownloadGJLevelInput = z.infer<typeof downloadGJLevelSchema>;

export const getGJDailyLevelSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    type: z.enum(["0", "1"]).transform(value => {
        switch (value) {
            case "0":
                return "Daily";
            case "1":
                return "Weekly";
        }
    }),
    secret: z.string()
});

export type GetGJDailyLevelInput = z.infer<typeof getGJDailyLevelSchema>;

export const deleteGJLevelUserSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    levelID: z.coerce.number().int(),
    secret: z.string()
});

export type DeleteGJLevelUserInput = z.infer<typeof deleteGJLevelUserSchema>;

export const updateGJDescSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    levelID: z.coerce.number().int(),
    levelDesc: z.string(),
    secret: z.string()
});

export type UpdateGJDescInput = z.infer<typeof updateGJDescSchema>;

export const suggestGJStarsSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    levelID: z.coerce.number().int(),
    stars: z.coerce.number().int(),
    feature: z.enum(["0", "1", "2", "3", "4"]).transform(value => {
        switch (value) {
            case "0":
                return "None";
            case "1":
                return "Featured";
            case "2":
                return "Epic";
            case "3":
                return "Legendary";
            case "4":
                return "Mythic";
        }
    }),
    secret: z.string()
});

export type SuggestGJStarsInput = z.infer<typeof suggestGJStarsSchema>;

export const rateGJStarsSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    levelID: z.coerce.number().int(),
    stars: z.coerce.number().int(),
    secret: z.string()
});

export type RateGJStarsInput = z.infer<typeof rateGJStarsSchema>;

export const rateGJDemonSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    levelID: z.coerce.number().int(),
    rating: z.enum(["1", "2", "3", "4", "5"]).transform(value => {
        switch (value) {
            case "1":
                return "EasyDemon";
            case "2":
                return "MediumDemon";
            case "3":
                return "HardDemon";
            case "4":
                return "InsaneDemon";
            case "5":
                return "ExtremeDemon";
        }
    }),
    mode: z.string().transform(value => {
        switch (value) {
            case "1":
                return "Mod";
            default:
                return "User";
        }
    }).catch("User"),
    secret: z.string()
});

export type RateGJDemonInput = z.infer<typeof rateGJDemonSchema>;