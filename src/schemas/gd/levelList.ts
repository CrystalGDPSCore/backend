import { z } from "zod";

export const uploadGJLevelListSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    listID: z.coerce.number().int(),
    listName: z.string(),
    listDesc: z.string(),
    listLevels: z.string().transform(value => value.split(",").map(levelId => parseInt(levelId))),
    difficulty: z.enum(["-1", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]).transform(value => {
        switch (value) {
            case "-1":
                return "NA";
            case "0":
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
            case "6":
                return "EasyDemon";
            case "7":
                return "MediumDemon";
            case "8":
                return "HardDemon";
            case "9":
                return "InsaneDemon";
            case "10":
                return "ExtremeDemon";
        }
    }),
    original: z.coerce.number().int(),
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
    secret: z.string()
});

export type UploadGJLevelListInput = z.infer<typeof uploadGJLevelListSchema>;

export const getGJLevelListsSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    type: z.enum(["0", "1", "2", "3", "4", "5", "6", "7", "11", "12", "13", "27"]).transform(value => {
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
                return "UserLists";
            case "6":
                return "TopLists";
            case "7":
                return "Magic";
            case "11":
                return "Awarded";
            case "12":
                return "Followed";
            case "13":
                return "Friends";
            case "27":
                return "Sent";
        }
    }),
    str: z.string().transform(value => {
        if (isNaN(parseInt(value))) {
            return value;
        }

        return parseInt(value);
    }),
    diff: z.enum(["-1", "-2", "-3", "1", "2", "3", "4", "5"]).transform(value => {
        switch (value) {
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
    }).catch("NotSelected"),
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
    star: z.coerce.boolean().catch(false),
    followed: z.string().transform(value => value.split(",").map(userId => parseInt(userId))).catch([]),
    page: z.coerce.number().int(),
    secret: z.string()
});

export type GetGJLevelListsInput = z.infer<typeof getGJLevelListsSchema>;

export const deleteGJLevelListSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    listID: z.coerce.number().int(),
    secret: z.string()
});

export type DeleteGJLevelListInput = z.infer<typeof deleteGJLevelListSchema>;