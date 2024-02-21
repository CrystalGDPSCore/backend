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
    songSize = (Number(songSize) / (1024 * 1024)).toFixed(2);

    const song = {
        name: songName,
        size: Number(songSize),
        resource: `ng:${songId}`,
        link: songLink,
        artistName: artist,
        artistResource: `ng:${artist.toLowerCase()}`
    };

    return song;
}

export async function getAudioFromYoutube(video: string) {
    const videoInfo = await ytdl.getInfo(video);

    const title = transliterate(videoInfo.videoDetails.title);
    const artist = transliterate(videoInfo.videoDetails.author.name);
    const artistTag = videoInfo.videoDetails.author.user;

    const audioStream = ytdl.downloadFromInfo(videoInfo, { quality: "140" });

    await convertToMp3(audioStream, videoInfo.videoDetails.videoId);
    const audioSize = (statSync(`data/songs/${videoInfo.videoDetails.videoId}.mp3`).size / (1024 * 1024)).toFixed(2);

    const song = {
        name: title,
        size: Number(audioSize),
        resource: `yt:${videoInfo.videoDetails.videoId}`,
        link: `${server.domain}/songs/${videoInfo.videoDetails.videoId}.mp3`,
        artistName: artist,
        artistResource: `yt:${artistTag?.substring(1)}`
    };

    return song;
}