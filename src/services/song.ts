import { db } from "../utils/db";

import { CreateSongInput } from "../schemas/service/song";

export async function getSongById(id: number) {
    const song = await db.song.findUnique({
        where: {
            id
        },
        include: {
            artist: true
        }
    });

    return song;
}

export async function createSong(input: CreateSongInput) {
    const artist = await db.artist.upsert({
        where: {
            resource: input.artist.resource
        },
        create: {
            name: input.artist.name,
            resource: input.artist.resource
        },
        update: {},
        select: {
            id: true
        }
    });

    const song = await db.song.create({
        data: {
            artistId: artist.id,
            name: input.name,
            size: input.size,
            resource: input.resource,
            link: input.link
        },
        include: {
            artist: true
        }
    });

    return song;
}

export async function getSongByResource(resource: string) {
    const song = await db.song.findUnique({
        where: {
            resource
        },
        include: {
            artist: true
        }
    });

    return song;
}

export async function getSongs(songIds: Array<number>) {
    const songs = await db.song.findMany({
        where: {
            id: {
                in: songIds
            }
        },
        include: {
            artist: true
        }
    });

    return songs;
}