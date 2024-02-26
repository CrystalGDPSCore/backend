import { FastifyRequest, FastifyReply } from "fastify";

import { getGJSongInfoInput } from "../../schemas/song";

import { getSongInfoById } from "../../services/songs";

import { gdObjToString } from "../../utils/gdform";
import { checkSecret } from "../../utils/checks";

import { Secret } from "../../helpers/enums";

import { server } from "../../config.json";

export async function getGJSongInfoHandler(request: FastifyRequest<{ Body: getGJSongInfoInput }>, reply: FastifyReply) {
    const { songID, secret } = request.body;

    if (!checkSecret(secret, Secret.Common)) {
        return reply.send(-1);
    }

    const song = await getSongInfoById(Number(songID));

    if (!song) {
        return reply.send(-1);
    }

    if (song.isDisabled) {
        return reply.send(-2);
    }

    const songInfoObj = {
        1: song.id,
        2: song.name,
        4: song.artist.name,
        5: song.size,
        10: song.link
    };

    return reply.send(gdObjToString(songInfoObj, "~|~"));
}

export async function getCustomContentURLHandler(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(server.domain);
}