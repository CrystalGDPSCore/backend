import { FastifyRequest, FastifyReply } from "fastify";

import { GetSfxFileInput, GetMp3FileInput } from "../../schemas/other/customContent";

import { getSongById } from "../../services/song";

import { server } from "../../config.json";

export async function getSfxFileController(request: FastifyRequest<{ Params: GetSfxFileInput }>, reply: FastifyReply) {
    const { file } = request.params;

    return reply.redirect(`https://geometrydashfiles.b-cdn.net/sfx/${file}`);
}

export async function getMp3FileController(request: FastifyRequest<{ Params: GetMp3FileInput }>, reply: FastifyReply) {
    const { songId } = request.params;

    const songInfo = await getSongById(songId);

    if (!songInfo || songInfo.isDisabled) {
        return reply.redirect(server.domain);
    }

    return reply.redirect(songInfo.link);
}