import { FastifyRequest, FastifyReply } from "fastify";

import { GetGJSongInfoInput } from "../../schemas/gd/customContent";

import { getSongById } from "../../services/song";

import { gdObjToString } from "../../utils/gdForm";

import { server } from "../../config.json";

export async function getGJSongInfoController(request: FastifyRequest<{ Body: GetGJSongInfoInput }>, reply: FastifyReply) {
    const { songID } = request.body;

    const song = await getSongById(songID);

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

export async function getCustomContentURLController(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(server.domain);
}