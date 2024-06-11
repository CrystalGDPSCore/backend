import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import { getGJCommentsController, uploadGJCommentController, deleteGJCommentController, getGJCommentHistoryController } from "../../controllers/gd/comment";

import checkSecret from "../../middlewares/checkSecret";

import { uploadGJCommentSchema, getGJCommentsSchema, deleteGJCommentSchema, getGJCommentHistorySchema } from "../../schemas/gd/comment";

import { Secret } from "../../helpers/enums";

export default async function gdCommentRoutes(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post("/uploadGJComment21.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: uploadGJCommentSchema
        }
    }, uploadGJCommentController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/getGJComments21.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: getGJCommentsSchema
        }
    }, getGJCommentsController);

    fastify.post("/deleteGJComment20.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: deleteGJCommentSchema
        }
    }, deleteGJCommentController);

    fastify.post("/getGJCommentHistory.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: getGJCommentHistorySchema
        }
    }, getGJCommentHistoryController);
}