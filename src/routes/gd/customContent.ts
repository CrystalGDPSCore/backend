import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import { getGJSongInfoController, getCustomContentURLController } from "../../controllers/gd/customContent";

import checkSecret from "../../middlewares/checkSecret";

import { getGJSongInfoSchema } from "../../schemas/gd/customContent";

import { Secret } from "../../helpers/enums";

export default async function gdCustomContentRoutes(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post("/getGJSongInfo.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: getGJSongInfoSchema
        }
    }, getGJSongInfoController);

    fastify.post("/getCustomContentURL.php", getCustomContentURLController);
}