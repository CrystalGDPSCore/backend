import ytdl from "ytdl-core";

import { db } from "../utils/db";

import { addSongInput } from "../schemas/song";

export async function getSongInfoById(id: number) {
    const song = await db.songs.findUnique({
        where: {
            id
        },
        include: {
            artist: true
        }
    });

    return song;
}

export async function addSong(input: addSongInput, artistResource: string, artistName: string) {
    const artist = await db.artists.upsert({
        where: {
            resource: artistResource
        },
        create: {
            name: artistName,
            resource: artistResource
        },
        update: {},
        select: {
            id: true
        }
    });

    const song = await db.songs.create({
        data: {
            artistId: artist.id,
            ...input
        },
        include: {
            artist: true
        }
    });

    return song;
}

export async function getSongInfoByResource(resource: string) {
    const song = await db.songs.findFirst({
        where: {
            resource
        },
        include: {
            artist: true
        }
    });

    return song;
}

export function convertUrlToResource(song: number | string) {
    if (typeof song === "number") {
        return `ng:${song}`;
    } else {
        try {
            const videoId = ytdl.getVideoID(song);
            return `yt:${videoId}`;
        } catch {
            return null;
        }
    }
}

export function convertResourceToUrl(resource: string) {
    const res = resource.split(":");
    if (res[0] == "ng") {
        return `https://www.newgrounds.com/audio/listen/${res[1]}`;
    } else {
        return `https://www.youtube.com/watch?v=${res[1]}`;
    }
}