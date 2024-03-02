import path from "path";

import { FastifyRequest, FastifyReply } from "fastify";

export async function addSongHandler(request: FastifyRequest, reply: FastifyReply) {
    return reply.sendFile("addSong.html", path.join(__dirname, "../../../../templates"));
}