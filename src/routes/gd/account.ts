import { FastifyInstance } from "fastify";

import {
    registerGJAccountHandler,
    loginGJAccountHandler,
    backupGJAccountNewHandler,
    syncGJAccountNewHandler,
    updateGJAccSettingsHandler,
    getAccountUrlHandler
} from "../../controllers/gd/account";

export default async function gdAccountRoutes(fastify: FastifyInstance) {
    fastify.post("/accounts/registerGJAccount.php", registerGJAccountHandler);
    fastify.post("/accounts/loginGJAccount.php", loginGJAccountHandler);
    fastify.post("/database/accounts/backupGJAccountNew.php", backupGJAccountNewHandler);
    fastify.post("/database/accounts/syncGJAccountNew.php", syncGJAccountNewHandler);
    fastify.post("/updateGJAccSettings20.php", updateGJAccSettingsHandler);
    fastify.post("/getAccountURL.php", getAccountUrlHandler);
}