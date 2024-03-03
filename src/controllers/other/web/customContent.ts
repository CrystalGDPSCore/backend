import { FastifyRequest, FastifyReply } from "fastify";

import { getSfxFileInput, getMp3FileInput } from "../../../schemas/customContent";

import { getSongInfoById } from "../../../services/songs";

import { server } from "../../../config.json";

export async function getSfxFileHandler(request: FastifyRequest<{ Params: getSfxFileInput }>, reply: FastifyReply) {
    return reply.redirect(`https://geometrydashfiles.b-cdn.net/sfx/${request.params.file}`);
}

export async function getMp3Handler(request: FastifyRequest<{ Querystring: getMp3FileInput }>, reply: FastifyReply) {
    const songId = request.query.id;

    const songInfo = await getSongInfoById(Number(songId));

    if (!songInfo || songInfo.isDisabled) {
        return reply.redirect(server.domain);
    }

    return reply.redirect(String(songInfo.link));
}