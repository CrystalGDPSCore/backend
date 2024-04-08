import path from "path";
import { statSync } from "fs";

import * as cheerio from "cheerio";
import ytdl from "ytdl-core";

import transliterate from "./transliterate";
import convertToMp3 from "./ffmpeg";

import { server } from "../config.json";

export async function getAudioFromNewgrounds(songId: number) {
    const htmlBody = await (await fetch(`https://www.newgrounds.com/audio/listen/${songId}`)).text();
    const $ = cheerio.load(htmlBody);

    const artist = $(".item-details-main h4 a").first().text();
    const songName = $("title").text();

    let songLink = "https://audio.ngfiles.com/";

    for (let i = 19; !songLink.endsWith(".mp3"); i++) {
        songLink += htmlBody[htmlBody.indexOf("audio.ngfiles.com") + i];
    }

    songLink = songLink.replace(/\\/g, "");

    let songSize = (await fetch(songLink, { method: "HEAD" })).headers.get("content-length");
    songSize = (parseInt(songSize as string) / (1024 * 1024)).toFixed(2);

    const songObj = {
        name: songName,
        size: parseInt(songSize),
        resource: `ng:${songId}`,
        link: songLink,
        artist: {
            name: artist,
            resource: `ng:${artist.toLowerCase()}`
        }
    };

    return songObj;
}

export async function getAudioFromYoutube(video: string) {
    const videoInfo = await ytdl.getInfo(video);

    const title = transliterate(videoInfo.videoDetails.title);
    const artist = transliterate(videoInfo.videoDetails.author.name);
    const artistTag = videoInfo.videoDetails.author.user!;

    const audioStream = ytdl.downloadFromInfo(videoInfo, { quality: "140" });

    await convertToMp3(audioStream, videoInfo.videoDetails.videoId);
    const audioSize = (statSync(path.join(__dirname, "../../", "data", "songs", `${videoInfo.videoDetails.videoId}.mp3`)).size / (1024 * 1024)).toFixed(2);

    const songObj = {
        name: title,
        size: parseInt(audioSize),
        resource: `yt:${videoInfo.videoDetails.videoId}`,
        link: `${server.domain}/songs/${videoInfo.videoDetails.videoId}.mp3`,
        artist: {
            name: artist,
            resource: artistTag.startsWith("@") ? `yt:${artistTag.slice(1)}` : `yt:${artistTag}`
        }
    };

    return songObj;
}