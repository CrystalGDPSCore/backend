import { FastifyRequest, FastifyReply } from "fastify";

import { redis } from "../../utils/db";

import { ApiAddSongInput, ApiGetSongInfoInput } from "../../schemas/api/song";

import { getSongByResource, getSongById, createSong } from "../../services/song";

import { addDataToMusicLibrary } from "../../utils/musicLibrary";
import { convertSongUrlToResource } from "../../utils/converts";
import { getAudioFromNewgrounds, getAudioFromYoutube } from "../../utils/fetch";

import { SongError } from "../../helpers/enums";

import { timeLimits } from "../../config.json";

export async function apiGetSongInfoController(request: FastifyRequest<{ Body: ApiGetSongInfoInput }>, reply: FastifyReply) {
    const { id } = request.body;

    const songInfo = await getSongById(id);

    if (!songInfo) {
        return reply.code(500).send({
            success: false,
            code: SongError.SongNotFound,
            message: `Song with this id ${id} doesn't exist`
        });
    }

    return reply.send({
        success: true,
        song: songInfo
    });
}

export async function apiAddSongController(request: FastifyRequest<{ Body: ApiAddSongInput }>, reply: FastifyReply) {
    const { song } = request.body;
    const { userId } = await request.jwtDecode<{ userId: number }>();

    if (await redis.exists(`${userId}:addedSong`)) {
        return reply.code(202).send({
            success: false,
            code: SongError.SongAddedTimeLimit,
            message: "You have already added a song recently"
        });
    }

    const songResource = convertSongUrlToResource(song);

    if (!songResource) {
        return reply.code(400).send({
            success: false,
            code: SongError.SongIncorrectLink,
            message: "Incorrect YouTube link"
        });
    }

    const songInfoFromResource = await getSongByResource(songResource);

    if (songInfoFromResource) {
        return reply.code(202).send({
            success: false,
            code: SongError.SongAlreadyUploaded,
            message: `Song already uploaded. ID: ${songInfoFromResource.id}`
        });
    }

    const [songInfo, tagId] = typeof song === "number" ? [await getAudioFromNewgrounds(song), 2] : [await getAudioFromYoutube(song), 1];

    const addedSongInfo = await createSong(songInfo);

    addDataToMusicLibrary({
        id: addedSongInfo.id,
        name: addedSongInfo.name,
        artistId: addedSongInfo.artistId,
        size: addedSongInfo.size * (1024 * 1024),
        length: 71, // idk how to get length of the song
        tagId: tagId
    }, {
        id: addedSongInfo.artistId,
        name: addedSongInfo.artist.name
    });

    await redis.set(`${userId}:addedSong`, 1, "EX", timeLimits.addSong);

    return reply.send({
        success: true,
        song: {
            id: addedSongInfo.id,
            ...songInfo
        }
    });
}