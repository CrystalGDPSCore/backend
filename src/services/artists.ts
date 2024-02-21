import { db } from "../utils/db";

export async function getSongsByArtistId(id: number) {
    const artist = await db.artists.findUnique({
        where: {
            id
        },
        select: {
            songs: true
        }
    });

    return artist?.songs;
}