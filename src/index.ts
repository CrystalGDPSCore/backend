import path from "path";

import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyFormbody from "@fastify/formbody";

import { songSchemas } from "./schemas/song";
import { accountSchemas } from "./schemas/account";
import { userSchemas } from "./schemas/user";

import accountRoutes from "./routes/other/web/account";
import customContentRoutes from "./routes/other/web/customContent";
import songRoutes from "./routes/other/web/song";

import apiAccountRoutes from "./routes/other/api/account";
import apiSongRoutes from "./routes/other/api/song";

import gdAccountRoutes from "./routes/gd/account";
import gdCustomContentRoutes from "./routes/gd/customContent";
import gdUserRoutes from "./routes/gd/user";

import { database } from "./config.json";

const fastify = Fastify({
    logger: true
});

async function main() {
    fastify.register(fastifyFormbody);

    fastify.register(fastifyStatic, {
        root: path.join(__dirname, "../data/songs"),
        prefix: "/songs"
    });
    fastify.register(fastifyStatic, {
        root: path.join(__dirname, "../data/music"),
        prefix: "/music",
        decorateReply: false
    });

    fastify.register(accountRoutes, { prefix: "account" });
    fastify.register(songRoutes, { prefix: "song" });
    fastify.register(customContentRoutes);

    for (const apiRoute of [apiAccountRoutes, apiSongRoutes]) {
        fastify.register(apiRoute, { prefix: "api" });
    }

    for (const gdRoute of [gdAccountRoutes, gdCustomContentRoutes, gdUserRoutes]) {
        fastify.register(gdRoute, { prefix: database.prefix });
    }

    for (const schema of [...songSchemas, ...accountSchemas, ...userSchemas]) {
        fastify.addSchema(schema);
    }

    fastify.listen(err => {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
    });
}

main();