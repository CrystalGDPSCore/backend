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