import { FastifyRequest, FastifyReply } from "fastify";

import { Secret } from "../helpers/enums";

export default function checkSecret(checkingSecret: Secret, errorCode: number = -1) {
    return async (request: FastifyRequest<{ Body: { secret: string } }>, reply: FastifyReply) => {
        const { secret } = request.body;

        if (secret != checkingSecret) {
            return reply.send(errorCode);
        }
    }
}