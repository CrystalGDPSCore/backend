import { FastifyRequest, FastifyReply } from "fastify";

import { getSongInfoById } from "../../../services/songs";

import { server } from "../../../config.json";

export async function getSfxFileHandler(request: FastifyRequest<{ Params: { file: string } }>, reply: FastifyReply) {
    return reply.redirect(`https://geometrydashfiles.b-cdn.net/sfx/${request.params.file}`);
}

export async function getMp3Handler(request: FastifyRequest<{ Querystring: { id: number } }>, reply: FastifyReply) {
    const songId = request.query.id;
    const songInfo = await getSongInfoById(Number(songId));

    if (songInfo?.isDisabled) {
        return reply.redirect(server.domain);
    }

    return reply.redirect(String(songInfo?.link));
}