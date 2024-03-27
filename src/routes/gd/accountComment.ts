import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import { uploadGJAccCommentController, getGJAccountCommentsController, deleteGJAccCommentController } from "../../controllers/gd/accountComment";

import checkSecret from "../../middlewares/checkSecret";

import { uploadGJAccCommentSchema, getGJAccountCommentsSchema, deleteGJAccCommentSchema } from "../../schemas/gd/accountComment";

import { Secret } from "../../helpers/enums";

export default async function gdAccountCommentRoutes(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post("/uploadGJAccComment20.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: uploadGJAccCommentSchema
        }
    }, uploadGJAccCommentController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/getGJAccountComments20.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: getGJAccountCommentsSchema
        }
    }, getGJAccountCommentsController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/deleteGJAccComment20.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: deleteGJAccCommentSchema
        }
    }, deleteGJAccCommentController);
}