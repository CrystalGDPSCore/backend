import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import {
    registerGJAccountController,
    loginGJAccountController,
    updateGJAccSettingsController,
    backupGJAccountNewController,
    syncGJAccountNewController,
    getAccountUrlController
} from "../../controllers/gd/account";

import checkSecret from "../../middlewares/checkSecret";

import {
    registerGJAccountSchema,
    loginGJAccountSchema,
    updateGJAccSettingsSchema,
    backupGJAccountNewSchema,
    syncGJAccountNewSchema
} from "../../schemas/gd/account";

import { Secret } from "../../helpers/enums";

export default async function gdAccountRoutes(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post("/accounts/registerGJAccount.php", {
        preHandler: checkSecret(Secret.User),
        schema: {
            body: registerGJAccountSchema
        }
    }, registerGJAccountController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/accounts/loginGJAccount.php", {
        preHandler: checkSecret(Secret.User),
        schema: {
            body: loginGJAccountSchema
        }
    }, loginGJAccountController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/updateGJAccSettings20.php", {
        preHandler: checkSecret(Secret.User),
        schema: {
            body: updateGJAccSettingsSchema
        }
    }, updateGJAccSettingsController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/database/accounts/backupGJAccountNew.php", {
        preHandler: checkSecret(Secret.User),
        schema: {
            body: backupGJAccountNewSchema
        }
    }, backupGJAccountNewController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/database/accounts/syncGJAccountNew.php", {
        preHandler: checkSecret(Secret.User),
        schema: {
            body: syncGJAccountNewSchema
        }
    }, syncGJAccountNewController);

    fastify.post("/getAccountURL.php", getAccountUrlController);
}