import path from "path";
import { readFileSync, writeFileSync } from "fs";

import { redis } from "../../utils/db";

import { FastifyRequest, FastifyReply } from "fastify";

import { UploadGJLevelInput } from "../../schemas/gd/level";

import { getUserById } from "../../services/user";
import { levelExists, createLevel, updateLevel } from "../../services/level";

import { checkUserGjp2, safeBase64Decode } from "../../utils/crypt";

import { levels, timeLimits } from "../../config.json";

export async function uploadGJLevelController(request: FastifyRequest<{ Body: UploadGJLevelInput }>, reply: FastifyReply) {
    const {
        accountID,
        gjp2,
        levelID,
        levelName,
        levelDesc,
        levelVersion,
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
        version: levelVersion,
        length: levelLength,
        visibility: unlisted,
        requestedStars,
        coins,
        objectsCount: objects,
        defaultSongId: songID ? songID : audioTrack,
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

        const level = await updateLevel(levelID, {
            ...levelInfoObj,
            updateDate: new Date()
        });

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