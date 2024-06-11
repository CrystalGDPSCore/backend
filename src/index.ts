import "dotenv/config";

import path from "path";

import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyFormbody from "@fastify/formbody";
import fastifyJwt from "@fastify/jwt";

import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

import apiSongRoutes from "./routes/api/song";
import apiUserRoutes from "./routes/api/user";

import gdAccountRoutes from "./routes/gd/account";
import gdAccountCommentRoutes from "./routes/gd/accountComment";
import gdBlockRoutes from "./routes/gd/block";
import gdCommentRoutes from "./routes/gd/comment";
import gdCustomContentRoutes from "./routes/gd/customContent";
import gdFriendRequestRoutes from "./routes/gd/friendRequest";
import gdLevelRoutes from "./routes/gd/level";
import gdLevelPackRoutes from "./routes/gd/levelPack";
import gdMessageRoutes from "./routes/gd/message";
import gdRelationshipRoutes from "./routes/gd/relationship";
import gdRewardRoutes from "./routes/gd/reward";
import gdScoreRoutes from "./routes/gd/score";
import gdUserRoutes from "./routes/gd/user";

import customContentRoutes from "./routes/other/customContent";

import { dev, database, server } from "./config.json";

const fastify = Fastify({ logger: dev.logger });

async function main() {
    fastify.setValidatorCompiler(validatorCompiler);
    fastify.setSerializerCompiler(serializerCompiler);

    fastify.register(fastifyFormbody);

    fastify.register(fastifyJwt, {
        secret: process.env.JWT_SECRET!
    });

    fastify.register(fastifyStatic, {
        root: path.join(__dirname, "../data/songs"),
        prefix: "/songs"
    });
    fastify.register(fastifyStatic, {
        root: path.join(__dirname, "../data/music"),
        prefix: "/music",
        decorateReply: false
    });

    const apiRoutes = [
        apiSongRoutes,
        apiUserRoutes
    ];

    for (const apiRoute of apiRoutes) {
        fastify.register(apiRoute, { prefix: "api" });
    }

    const gdRoutes = [
        gdAccountRoutes,
        gdAccountCommentRoutes,
        gdBlockRoutes,
        gdCommentRoutes,
        gdCustomContentRoutes,
        gdFriendRequestRoutes,
        gdLevelRoutes,
        gdLevelPackRoutes,
        gdMessageRoutes,
        gdRelationshipRoutes,
        gdRewardRoutes,
        gdScoreRoutes,
        gdUserRoutes
    ];

    for (const gdRoute of gdRoutes) {
        fastify.register(gdRoute, { prefix: database.generalPath });
    }

    fastify.register(gdLevelRoutes, { prefix: database.secondaryPath });

    fastify.register(customContentRoutes);

    fastify.listen({ port: server.port }, err => {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
    });
}

main();