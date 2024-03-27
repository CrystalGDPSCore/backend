import { FastifyRequest, FastifyReply } from "fastify";

import { ApiLoginUserInput } from "../../schemas/api/user";

import { getUserByName } from "../../services/user";

import { checkUserGjp2, createGjp2 } from "../../utils/crypt";

import { UserError } from "../../helpers/enums";

export async function apiLoginUserController(request: FastifyRequest<{ Body: ApiLoginUserInput }>, reply: FastifyReply) {
    const { name, password } = request.body;

    const user = await getUserByName(name, "default");

    if (!user) {
        return reply.code(500).send({
            success: false,
            code: UserError.UserNotFound,
            message: "This user is not found"
        });
    }

    if (user.isDisabled) {
        return reply.code(500).send({
            success: false,
            code: UserError.UserIsDisabled,
            message: "This user is disabled"
        });
    }

    if (!checkUserGjp2(createGjp2(password), user.passHash)) {
        return reply.code(500).send({
            success: false,
            code: UserError.UserIncorrectPassword,
            message: "Incorrect password for this user"
        });
    }

    const token = await reply.jwtSign({
        userId: user.id,
        userName: user.userName
    });

    return reply.send({
        success: true,
        user: {
            token
        }
    });
}