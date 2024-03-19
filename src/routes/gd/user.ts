import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import { getGJUserInfoController, getGJUsersController, requestUserAccessController } from "../../controllers/gd/user";

import checkSecret from "../../middlewares/checkSecret";

import { getGJUserInfoSchema, getGJUsersSchema, requestUserAccessSchema } from "../../schemas/gd/user";

import { Secret } from "../../helpers/enums";

export default async function gdUserRoutes(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post("/getGJUserInfo20.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: getGJUserInfoSchema
        }
    }, getGJUserInfoController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/getGJUsers20.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: getGJUsersSchema
        }
    }, getGJUsersController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/requestUserAccess.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: requestUserAccessSchema
        }
    }, requestUserAccessController);
}