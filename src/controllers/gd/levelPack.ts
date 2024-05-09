import { FastifyRequest, FastifyReply } from "fastify";

import { GetGJGauntletsInput, GetGJMapPacksInput } from "../../schemas/gd/levelPack";

import { getUserById } from "../../services/user";
import { getGauntlets } from "../../services/gauntlet";
import { getMapPacks, getMapPacksCount } from "../../services/mapPack";

import { checkUserGjp2, hashGdObj } from "../../utils/crypt";
import { gdObjToString } from "../../utils/gdForm";
import { hexToRgb } from "../../utils/color";

import { Salt, MapPackDifficulty } from "../../helpers/enums";

export async function getGJGauntletsController(request: FastifyRequest<{ Body: GetGJGauntletsInput }>, reply: FastifyReply) {
    const { accountID, gjp2 } = request.body;

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.hashPassword)) {
        return reply.send(-1);
    }

    const gauntlets = await getGauntlets();

    if (!gauntlets.length) {
        return reply.send(-1);
    }

    const gauntletList = gauntlets.map(gauntlet => {
        const gauntletInfoObj = {
            1: gauntlet.id,
            3: gauntlet.levelIds.join(",")
        };

        return gdObjToString(gauntletInfoObj);
    }).join("|");

    const gauntletHashList = gauntlets.map(gauntlet => `${gauntlet.id}${gauntlet.levelIds.join(",")}`).join(""); // if you have problems with levels -> https://github.com/Cvolton/GMDprivateServer/issues/1070

    const generalInfo = [
        gauntletList,
        hashGdObj(gauntletHashList, Salt.Level)
    ].join("#");

    return reply.send(generalInfo); // to work gauntlets page, you need to create 4 gauntlets (it's 2.2 bug)
}

export async function getGJMapPacksController(request: FastifyRequest<{ Body: GetGJMapPacksInput }>, reply: FastifyReply) {
    const { accountID, gjp2, page } = request.body;

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.hashPassword)) {
        return reply.send(-1);
    }

    const mapPacks = await getMapPacks(page * 10);

    if (!mapPacks.length) {
        return reply.send(-1);
    }

    const mapPackList = mapPacks.map(mapPack => {
        const mapPackInfoObj = {
            1: mapPack.id,
            2: mapPack.name,
            3: mapPack.levelIds.join(","),
            4: mapPack.stars,
            5: mapPack.coins,
            6: MapPackDifficulty[mapPack.difficulty],
            7: hexToRgb(`#${mapPack.color}`).join(","),
            8: hexToRgb(`#${mapPack.color}`).join(",")
        };

        return gdObjToString(mapPackInfoObj);
    }).join("|");

    const mapPackHashList = mapPacks.map(mapPack => {
        const mapPackIdHash = `${String(mapPack.id)[0]}${String(mapPack.id).at(-1)}`;

        return `${mapPackIdHash}${mapPack.stars}${mapPack.coins}`;
    }).join("");

    const generalInfo = [
        mapPackList,
        [await getMapPacksCount(), page * 10, 10].join(":"),
        hashGdObj(mapPackHashList, Salt.Level)
    ].join("#");

    return reply.send(generalInfo);
}