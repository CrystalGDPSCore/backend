import ytdl from "ytdl-core";

export function convertSongUrlToResource(song: number | string) {
    if (typeof song === "number") {
        return `ng:${song}`;
    }

    try {
        const videoId = ytdl.getVideoID(song);
        return `yt:${videoId}`;
    } catch {
        return null;
    }
}

export function convertResourceToSongUrl(resource: string) {
    const res = resource.split(":");

    if (res[0] == "ng") {
        return `https://www.newgrounds.com/audio/listen/${res[1]}`;
    }

    return `https://www.youtube.com/watch?v=${res[1]}`;
}