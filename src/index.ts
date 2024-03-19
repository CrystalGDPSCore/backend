import "dotenv/config";

import path from "path";

import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyFormbody from "@fastify/formbody";

import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

import apiCustomContentRoutes from "./routes/api/customContent";

import gdAccountRoutes from "./routes/gd/account";
import gdCustomContentRoutes from "./routes/gd/customContent";
import gdRewardRoutes from "./routes/gd/reward";
import gdScoreRoutes from "./routes/gd/score";
import gdUserRoutes from "./routes/gd/user";

import customContentRoutes from "./routes/other/customContent";

import { database, server } from "./config.json";

const fastify = Fastify({ logger: true });

async function main() {
    fastify.setValidatorCompiler(validatorCompiler);
    fastify.setSerializerCompiler(serializerCompiler);

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

    for (const apiRoute of [apiCustomContentRoutes]) {
        fastify.register(apiRoute, { prefix: "api" });
    }

    for (const gdRoute of [gdAccountRoutes, gdCustomContentRoutes, gdRewardRoutes, gdScoreRoutes, gdUserRoutes]) {
        fastify.register(gdRoute, { prefix: database.path });
    }

    fastify.register(customContentRoutes);

    fastify.listen({ port: server.port }, err => {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
    });
}

main();