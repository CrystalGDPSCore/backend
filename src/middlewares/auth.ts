import { FastifyRequest, FastifyReply } from "fastify";

export default async function auth(request: FastifyRequest<{ Body: {} }>, reply: FastifyReply) {
    try {
        await request.jwtVerify();
    } catch(error) {
        return reply.send(error);
    }
}