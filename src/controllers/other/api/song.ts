import { FastifyRequest, FastifyReply } from "fastify";

import { redis } from "../../../utils/db";

import { getSongInfoById, addSong, getSongInfoByResource, convertUrlToResource } from "../../../services/songs";

import { songIDInput, apiAddSongInput } from "../../../schemas/song";

import addDataToMusicLibrary from "../../../utils/musicLibrary";
import { getAudioFromNewgrounds, getAudioFromYoutube } from "../../../utils/fetch";

import { ErrorCode } from "../../../helpers/enums";

export async function apiGetSongInfoByIDHandler(request: FastifyRequest< { Body: songIDInput } >, reply: FastifyReply) {
    const { id } = request.body;

    const song = await getSongInfoById(id);

    if (!song) {
        return reply.code(500).send({
            code: ErrorCode.SongNotFound,
            message: `Cannot find song with ID: ${id}`
        });
    }

    return reply.send(song);
}

export async function apiAddSongHandler(request: FastifyRequest< { Body: apiAddSongInput } >, reply: FastifyReply) {
    const { song } = request.body;

    if (await redis.exists(`${request.ip}:addedSong`)) {
        return reply.code(202).send({
            code: ErrorCode.AddedSongTimeLimit,
            message: "You have already added a song recently"
        });
    }

    const songResource = convertUrlToResource(song);

    if (!songResource) {
        return reply.code(500).send({
            code: ErrorCode.IncorrectLink,
            message: "Incorrect YouTube link"
        });
    }

    const songInfoFromResource = await getSongInfoByResource(songResource);

    if (songInfoFromResource) {
        return reply.code(202).send({
            code: ErrorCode.SongAlreadyUploaded,
            message: `Song already uploaded. ID: ${songInfoFromResource.id}`
        });
    }

    let songInfo;
    let tagId;

    if (typeof song === "number") {
        songInfo = await getAudioFromNewgrounds(song);
        tagId = ".2.";
    } else {
        songInfo = await getAudioFromYoutube(song);
        tagId = ".1.";
    }

    const addedSongInfo = await addSong({
        name: songInfo.name,
        size: songInfo.size,
        link: songInfo.link,
        resource: songInfo.resource
    }, songInfo.artistResource, songInfo.artistName);

    addDataToMusicLibrary(
        [
            addedSongInfo.id,
            addedSongInfo.name,
            addedSongInfo.artistId,
            addedSongInfo.size * (1024 * 1024),
            71,
            tagId
        ],
        [
            addedSongInfo.artistId,
            addedSongInfo.artist.name,
            " ",
            " "
        ]
    );

    await redis.set(`${request.ip}:addedSong`, 1, "EX", 60 * 60);

    return reply.send({ id: addedSongInfo.id });
}