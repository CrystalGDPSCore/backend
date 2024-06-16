import path from "path";
import { readFileSync, writeFileSync, rmSync } from "fs";

import { $Enums, Prisma } from "@prisma/client";

import { redis } from "../../utils/db";

import { FastifyRequest, FastifyReply } from "fastify";

import {
    UploadGJLevelInput,
    GetGJLevelsInput,
    DownloadGJLevelInput,
    GetGJDailyLevelInput,
    DeleteGJLevelUserInput,
    SuggestGJStarsInput,
    UpdateGJDescInput,
    RateGJStarsInput,
    RateGJDemonInput
} from "../../schemas/gd/level";

import {
    levelExists,
    createLevel,
    updateLevel,
    getLevelById,
    getLevels,
    getLevelsCount,
    deleteLevel,
    updateLevelDescription,
    rateLevel,
    rateLevelDemon
} from "../../services/level";
import { getUserById, getUsers } from "../../services/user";
import { getGauntletLevels } from "../../services/gauntlet";
import { getSongs } from "../../services/song";
import { getFriendList, friendExists } from "../../services/friendList";
import { getSuggestLevelIds, createLevelSuggest, suggestLevelExists } from "../../services/suggestLevel";
import { createDifficultySuggest } from "../../services/suggestLevelDifficulty";
import { downloadExists, createDownload } from "../../services/download";
import { getEvent, getEventLevel, getEventLevelIds } from "../../services/event";
import { getListById } from "../../services/levelList";

import { checkUserGjp2, safeBase64Decode, hashGdObj, base64Encode, hashGdLevel } from "../../utils/crypt";
import { gdObjToString, getDifficultyFromStars } from "../../utils/gdForm";
import { getRelativeTime } from "../../utils/relativeTime";

import { ReturnLevelDifficulty, LevelLength, SelectDemonDifficulty, Salt, LevelRatingType, ReturnDemonDifficulty } from "../../helpers/enums";

import { levels, timeLimits } from "../../config.json";

export async function uploadGJLevelController(request: FastifyRequest<{ Body: UploadGJLevelInput }>, reply: FastifyReply) {
    const {
        accountID,
        gjp2,
        levelID,
        levelName,
        levelDesc,
        levelLength,
        audioTrack,
        original,
        twoPlayer,
        songID,
        objects,
        coins,
        requestedStars,
        unlisted,
        ldm,
        songIDs,
        sfxIDs,
        levelString
    } = request.body;

    const reservedLevelIds = [3001, 5001, 5002, 5003, 5004];

    const isLevelUploaded = Boolean(await redis.exists(`${accountID}:uploadLevel`));

    if (isLevelUploaded) {
        return reply.send(-1);
    }

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.hashPassword)) {
        return reply.send(-1);
    }

    if (!levelName.length || !levelString.length) {
        return reply.send(-1);
    }

    const description = safeBase64Decode(levelDesc);

    if (description.length > 180) {
        return reply.send(-1);
    }

    if (objects < levels.minObjects) {
        return reply.send(-1);
    }

    const levelInfoObj = {
        description,
        length: levelLength,
        visibility: unlisted,
        requestedStars,
        coins,
        objectsCount: objects,
        defaultSongId: songID ?? audioTrack,
        sfxIds: sfxIDs,
        songIds: songIDs,
        isCustomSong: songID ? true : false,
        hasLdm: ldm,
        hasTwoPlayerMode: twoPlayer
    };

    let levelId = 0;

    if (levelID) {
        if (!await levelExists(levelID)) {
            return reply.send(-1);
        }

        const level = await updateLevel(levelID, levelInfoObj);

        writeFileSync(path.join(__dirname, "../../../", "data", "levels", `${level.id}.lvl`), levelString);

        levelId = level.id;
    } else {
        let lastLevelId = parseInt(readFileSync(path.join(__dirname, "../../../", "data", "levels", "lastId.txt"), "utf-8"));

        if (reservedLevelIds.includes(lastLevelId + 1)) {
            lastLevelId += 100;
        } else {
            lastLevelId++;
        }

        const level = await createLevel({
            id: lastLevelId,
            authorId: accountID,
            name: levelName,
            originalLevelId: original,
            ...levelInfoObj
        });

        writeFileSync(path.join(__dirname, "../../../", "data", "levels", `${level.id}.lvl`), levelString);
        writeFileSync(path.join(__dirname, "../../../", "data", "levels", "lastId.txt"), String(lastLevelId));

        levelId = level.id;
    }

    await redis.set(`${accountID}:uploadLevel`, 1, "EX", timeLimits.uploadLevel);

    return reply.send(levelId);
}

export async function getGJLevelsController(request: FastifyRequest<{ Body: GetGJLevelsInput }>, reply: FastifyReply) {
    const {
        accountID,
        gjp2,
        type,
        str,
        diff,
        len,
        page,
        uncompleted,
        onlyCompleted,
        completedLevels,
        featured,
        original,
        twoPlayer,
        coins,
        song,
        customSong,
        noStar,
        star,
        epic,
        mythic,
        legendary,
        demonFilter,
        followed,
        gauntlet
    } = request.body;

    if ((uncompleted && onlyCompleted) || (star && noStar)) {
        return reply.send(-1);
    }

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.hashPassword)) {
        return reply.send(-1);
    }

    const levelArgsObj: Prisma.LevelWhereInput = {
        visibility: "Listed"
    };

    const levelOrderByObj: Array<Prisma.LevelOrderByWithRelationInput> = [{}];

    let levels = [];
    let isGauntletLevel = false;
    let levelsCount = 0;

    if (gauntlet != -1) {
        const gauntletLevels = await getGauntletLevels(gauntlet);

        if (!gauntletLevels.length) {
            return reply.send(-1);
        }

        levels = gauntletLevels;
        isGauntletLevel = true;
    } else {
        if (str && typeof str == "number") {
            levelArgsObj.id = str;
        } else {
            levelOrderByObj[0].likes = "desc";

            if (song != -1) {
                levelArgsObj.defaultSongId = song;
                levelArgsObj.isCustomSong = customSong;
            }

            if (noStar) {
                levelArgsObj.stars = 0;
            }
            
            if (star) {
                levelArgsObj.stars = { gt: 0 };
            }

            let ratingTypes: Array<$Enums.LevelRating> = [];

            if (featured || epic || legendary || mythic) {
                if (featured) {
                    ratingTypes.push("Featured");
                }

                if (epic) {
                    ratingTypes.push("Epic");
                }

                if (legendary) {
                    ratingTypes.push("Mythic");
                }

                if (mythic) {
                    ratingTypes.push("Legendary");
                }

                levelArgsObj.ratingType = { in: ratingTypes };
            }

            if (original) {
                levelArgsObj.originalLevelId = 0;
            }

            if (twoPlayer) {
                levelArgsObj.hasTwoPlayerMode = true;
            }

            if (coins) {
                levelArgsObj.coins = { gt: 0 };
                levelArgsObj.isCoinsVerified = true;
            }
            
            if (completedLevels.length) {
                if (onlyCompleted) {
                    levelArgsObj.id = { in: completedLevels };
                } else {
                    levelArgsObj.id = { notIn: completedLevels };
                }
            }

            if (len[0] != "NotSelected") {
                levelArgsObj.length = { in: len.filter(levelLength => levelLength != "NotSelected") as Array<$Enums.LevelLength> };
            }

            if (diff[0] != "NotSelected") {
                if (diff[0] == "Demon") {
                    levelArgsObj.difficulty = demonFilter == "NotSelected" ? { in: ["EasyDemon", "MediumDemon", "HardDemon", "InsaneDemon", "ExtremeDemon"] } : demonFilter;
                } else {
                    levelArgsObj.difficulty = { in: diff.filter(levelDifficulty => levelDifficulty != "NotSelected" && levelDifficulty != "Demon") as Array<$Enums.Difficulty> };
                }
            }
        }

        switch (type) {
            case "Search":
                if (str && typeof str == "string") {
                    levelArgsObj.name = { startsWith: str, mode: "insensitive" };
                } else {
                    levelArgsObj.visibility = { in: ["Listed", "Unlisted"] };
                }
                break;
            case "Downloads":
                delete levelOrderByObj[0].likes;

                levelOrderByObj[0].downloads = "desc";
                break;
            case "Recent":
                delete levelOrderByObj[0].likes;

                levelOrderByObj[0].createDate = "desc";
                break;
            case "Trending":
                levelArgsObj.createDate = { gt: new Date(Date.now() - 7 * 24 * 60 * 60000) };
                break;
            case "UserLevels":
                if (!(str && typeof str == "number")) {
                    return reply.send(-1);
                }

                delete levelArgsObj.id;
                
                levelOrderByObj[0].createDate = "desc";
                
                if (accountID == str) {
                    levelArgsObj.visibility = { in: ["Listed", "FriendsOnly", "Unlisted"] };
                }

                levelArgsObj.authorId = str;
                break;
            case "Featured":
                delete levelOrderByObj[0].likes;

                levelOrderByObj[0].rateDate = "desc";
                levelArgsObj.ratingType = { in: ["Featured", "Epic", "Legendary", "Mythic"] };
                levelArgsObj.stars = { gt: 0 };
                break;
            case "Magic":
                Object.keys(levelArgsObj).forEach(key => delete levelArgsObj[key as keyof typeof levelArgsObj]);

                levelArgsObj.visibility = "Listed";
                levelArgsObj.objectsCount = { gte: 20000 };
                levelArgsObj.length = { in: ["Long", "XL"] };
                levelArgsObj.hasLdm = true;
                levelArgsObj.originalLevelId = 0;
                levelArgsObj.stars = 0;
                break;
            case "MapPacks":
                delete levelOrderByObj[0].likes;

                if (typeof str == "object" && str.length) {
                    levelArgsObj.id = { in: str };
                }
                break;
            case "Awarded":
                delete levelOrderByObj[0].likes;

                levelOrderByObj[0].rateDate = "desc";
                levelArgsObj.stars = { gt: 0 };
                break;
            case "Followed":
                delete levelOrderByObj[0].likes;

                levelOrderByObj[0].createDate = "desc";
                levelArgsObj.authorId = { in: followed };
                break;
            case "Friends":
                delete levelOrderByObj[0].likes;

                const friendIds = (await getFriendList(accountID)).map(friend => friend.id);

                levelOrderByObj[0].createDate = "desc";
                levelArgsObj.visibility = { in: ["Listed", "FriendsOnly"] };
                levelArgsObj.authorId = { in: friendIds };
                break;
            case "DailySafe":
            case "WeeklySafe":
            // case "EventSafe":
                delete levelOrderByObj[0].likes;

                const eventType = type == "DailySafe" ? "Daily": "Weekly";

                const eventLevelIds = await getEventLevelIds(eventType, page * 10);

                levelOrderByObj[0].event = { assignDate: "desc" };
                levelArgsObj.id = { in: eventLevelIds };
                break;
            case "LevelList":
                if (!(str && typeof str == "number")) {
                    return reply.send(-1);
                }

                delete levelArgsObj.id;

                const levelList = await getListById(str);

                if (!levelList) {
                    return reply.send(-1);
                }

                if (!await downloadExists(accountID, str, true)) {
                    await createDownload(accountID, str, true);
                }

                levelArgsObj.id = { in: levelList.levelIds };
                break;
            case "Sent":
                delete levelOrderByObj[0].likes;
                Object.keys(levelArgsObj).forEach(key => delete levelArgsObj[key as keyof typeof levelArgsObj]);

                const suggestLevelIds = await getSuggestLevelIds(page * 10);

                levelOrderByObj[0].suggest = { suggestDate: "desc" };
                levelArgsObj.id = { in: suggestLevelIds };
                break;
        }

        levels = await getLevels(levelArgsObj, levelOrderByObj, page * 10);
        levelsCount = await getLevelsCount(levelArgsObj);
    }

    if (!levels.length) {
        return reply.send(-1);
    }

    const levelList = levels.map(level => {
        const isLevelDemon = Object.keys(SelectDemonDifficulty).includes(level.difficulty) ? 1 : 0;

        const levelInfoObj = {
            1: level.id,
            2: level.name,
            5: level.version,
            6: level.authorId,
            8: level.difficulty == "NA" ? 0 : 10,
            9: ReturnLevelDifficulty[level.difficulty],
            10: level.downloads,
            12: level.isCustomSong ? 0 : level.defaultSongId,
            13: 22,
            14: level.likes,
            15: LevelLength[level.length],
            17: isLevelDemon,
            18: level.stars,
            19: level.ratingType == "Featured" ? 1 : 0,
            25: level.difficulty == "Auto" ? 1 : 0,
            30: level.originalLevelId,
            31: level.hasTwoPlayerMode ? 1 : 0,
            35: level.isCustomSong ? level.defaultSongId : 0,
            37: level.coins,
            38: level.isCoinsVerified ? 1 : 0,
            39: level.requestedStars,
            42: LevelRatingType[level.ratingType],
            43: isLevelDemon ? ReturnDemonDifficulty[level.difficulty as keyof typeof ReturnDemonDifficulty] : 0,
            44: isGauntletLevel ? 1 : 0,
            45: level.objectsCount
        };

        return gdObjToString(levelInfoObj);
    }).join("|");

    const levelHashList = levels.map(level => {
        const levelIdHash = `${String(level.id)[0]}${String(level.id).at(-1)}`;

        return `${levelIdHash}${level.stars}${level.isCoinsVerified ? 1 : 0}`;
    }).join("");

    const userList = (await getUsers(levels.map(level => level.authorId))).map(user => {
        const userInfo = [
            user.id,
            user.userName,
            user.id
        ].join(":");

        return userInfo;
    }).join("|");

    const songList = (await getSongs(levels.filter(level => level.isCustomSong).map(level => level.defaultSongId))).map(song => {
        const songInfoObj = {
            1: song.id,
            2: song.name,
            4: song.artist.name,
            5: song.size,
            10: song.link
        };

        return gdObjToString(songInfoObj, "~|~");
    }).join("~:~");

    const generalInfo = [
        levelList,
        userList,
        songList,
        [levelsCount, page * 10, 10].join(":"),
        hashGdObj(levelHashList, Salt.Level)
    ].join("#");

    return reply.send(generalInfo);
}

export async function downloadGJLevelController(request: FastifyRequest<{ Body: DownloadGJLevelInput }>, reply: FastifyReply) {
    const { accountID, gjp2, levelID } = request.body;

    const userOwn = await getUserById(accountID);

    if (!userOwn || userOwn.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, userOwn.hashPassword)) {
        return reply.send(-1);
    }

    let level;
    let eventId = 0;

    if (levelID < 0) {
        const eventType = levelID == -1 ? "Daily" : "Weekly";   
        const additionalId = levelID == -1 ? 0 : 100001;

        const event = await getEvent(eventType);

        if (!event) {
            return reply.send(-1);
        }

        level = await getEventLevel(eventType);
        eventId = event.id + additionalId;
    } else {
        level = await getLevelById(levelID);
    }

    if (!level) {
        return reply.send(-1);
    }

    if (level.visibility == "FriendsOnly" && accountID != level.authorId && !await friendExists(accountID, level.authorId)) {
        return reply.send(-1);
    }

    let levelData = "";

    try {
        levelData = readFileSync(path.join(__dirname, "../../../", "data", "levels", `${level.id}.lvl`), "utf-8")
    } catch {
        return reply.send(-1);
    }

    const userTarget = await getUserById(level.authorId);

    if (!userTarget || userTarget.isDisabled) {
        return reply.send(-1);
    }

    if (!await downloadExists(accountID, levelID, false)) {
        await createDownload(accountID, levelID, false);
    }

    const isLevelDemon = Object.keys(SelectDemonDifficulty).includes(level.difficulty) ? 1 : 0;

    let levelInfoObj = {
        1: level.id,
        2: level.name,
        3: base64Encode(level.description ?? ""),
        4: levelData,
        5: level.version,
        6: level.authorId,
        8: level.difficulty == "NA" ? 0 : 10,
        9: ReturnLevelDifficulty[level.difficulty],
        10: level.downloads,
        12: level.isCustomSong ? 0 : level.defaultSongId,
        13: 22,
        14: level.likes,
        15: LevelLength[level.length],
        17: isLevelDemon,
        18: level.stars,
        19: level.ratingType == "Featured" ? 1 : 0,
        25: level.difficulty == "Auto" ? 1 : 0,
        27: 0,
        28: getRelativeTime(level.createDate),
        29: getRelativeTime(level.updateDate),
        30: level.originalLevelId,
        31: level.hasTwoPlayerMode ? 1 : 0,
        35: level.isCustomSong ? level.defaultSongId : 0,
        37: level.coins,
        38: level.isCoinsVerified ? 1 : 0,
        39: level.requestedStars,
        42: LevelRatingType[level.ratingType],
        43: isLevelDemon ? ReturnDemonDifficulty[level.difficulty as keyof typeof ReturnDemonDifficulty] : 0,
        45: level.objectsCount,
        52: level.songIds.join(","),
        53: level.sfxIds.join(",")
    };

    if (eventId) {
        levelInfoObj = Object.assign(levelInfoObj, { 41: eventId });
    }

    const levelInfoHash = [
        level.authorId,
        level.stars,
        isLevelDemon,
        level.id,
        level.isCoinsVerified ? 1 : 0,
        level.ratingType == "Featured" ? 1 : 0,
        0,
        eventId
    ].join(",");

    const generalInfo = [
        gdObjToString(levelInfoObj),
        hashGdLevel(levelData),
        hashGdObj(levelInfoHash, Salt.Level),
        [userTarget.id, userTarget.userName, level.authorId].join(":")
    ].join("#");

    return reply.send(generalInfo);
}

export async function getGJDailyLevelController(request: FastifyRequest<{ Body: GetGJDailyLevelInput }>, reply: FastifyReply) {
    const { accountID, gjp2, type } = request.body;

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.hashPassword)) {
        return reply.send(-1);
    }

    const event = await getEvent(type);

    if (!event) {
        return reply.send(-1);
    }

    let timeleft = 0;
    let eventId = event.id;

    switch (type) {
        case "Daily":
            timeleft = Math.round((new Date().setHours(24, 0, 0, 0) - Date.now()) / 1000); // next day 00:00
            break;
        case "Weekly":
            const nextMonday = new Date();

            nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7 || 7));

            timeleft = Math.round((nextMonday.setHours(0, 0, 0, 0) - Date.now()) / 1000); // next monday 00:00
            eventId += 100001;
            break;
    }

    const generalInfo = [
        eventId,
        timeleft
    ].join("|");

    return reply.send(generalInfo);
}

export async function deleteGJLevelUserController(request: FastifyRequest<{ Body: DeleteGJLevelUserInput }>, reply: FastifyReply) {
    const { accountID, gjp2, levelID } = request.body;

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.hashPassword)) {
        return reply.send(-1);
    }

    const level = await getLevelById(levelID);

    if (!level || level.stars != 0) {
        return reply.send(-1);
    }

    if (accountID != level.authorId && ["None", "LeaderboardMod"].includes(user.modLevel)) {
        return reply.send(-1);
    }

    rmSync(path.join(__dirname, "../../../", "data", "levels", `${levelID}.lvl`));

    await deleteLevel(levelID);

    return reply.send(1);
}

export async function updateGJDescController(request: FastifyRequest<{ Body: UpdateGJDescInput }>, reply: FastifyReply) {
    const { accountID, gjp2, levelID, levelDesc } = request.body;

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.hashPassword)) {
        return reply.send(-1);
    }

    if (!await levelExists(levelID)) {
        return reply.send(-1);
    }

    const description = safeBase64Decode(levelDesc);

    if (description.length > 180) {
        return reply.send(-1);
    }

    await updateLevelDescription(levelID, description);

    return reply.send(1);
}

export async function suggestGJStarsController(request: FastifyRequest<{ Body: SuggestGJStarsInput }>, reply: FastifyReply) {
    const { accountID, gjp2, levelID, stars, feature } = request.body;

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.hashPassword)) {
        return reply.send(-1);
    }

    if (!await levelExists(levelID)) {
        return reply.send(-1);
    }

    if (["None", "LeaderboardMod"].includes(user.modLevel)) {
        return reply.send(-1);
    }

    let ability: "Suggest" | "Rate" = "Suggest";

    if (["ElderMod", "Admin"].includes(user.modLevel)) {
        ability = "Rate";
    }

    switch (ability) {
        case "Suggest":
            if (await suggestLevelExists(levelID)) {
                return reply.send(-1);
            }

            await createLevelSuggest({
                suggestById: accountID,
                levelId: levelID,
                difficulty: getDifficultyFromStars(stars),
                ratingType: feature,
                stars
            });
            break;
        case "Rate":
            let difficulty = getDifficultyFromStars(stars) as "Auto" | "Easy" | "Normal" | "Hard" | "Harder" | "Insane" | "HardDemon";

            if (getDifficultyFromStars(stars) == "Demon") {
                difficulty = "HardDemon";
            }

            await rateLevel(levelID, {
                difficulty,
                ratingType: feature,
                stars
            });
            break;
    }

    return reply.send(1);
}

export async function rateGJStarsController(request: FastifyRequest<{ Body: RateGJStarsInput }>, reply: FastifyReply) {
    const { accountID, gjp2, levelID, stars } = request.body;

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.hashPassword)) {
        return reply.send(-1);
    }

    const level = await getLevelById(levelID);

    if (!level || level.stars != 0) {
        return reply.send(-1);
    }

    await createDifficultySuggest({
        suggestById: accountID,
        levelId: levelID,
        stars
    });

    return reply.send(1);
}

export async function rateGJDemonController(request: FastifyRequest<{ Body: RateGJDemonInput }>, reply: FastifyReply) {
    const { accountID, gjp2, levelID, rating, mode } = request.body;

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.hashPassword)) {
        return reply.send(-1);
    }

    if (!await levelExists(levelID)) {
        return reply.send(-1);
    }

    if (mode == "User" || !["ElderMod", "Admin"].includes(user.modLevel)) {
        return reply.send(-1);
    }

    await rateLevelDemon(levelID, rating);

    return reply.send(levelID);
}