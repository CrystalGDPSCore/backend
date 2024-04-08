import path from "path";
import { writeFileSync, readFileSync } from "fs";

import fflate from "fflate";

import { songInfoObj, artistInfoObj } from "../schemas/util/musicLibrary";

export function getDataFromMusicLibrary() {
    const info = readFileSync(path.join(__dirname, "../../", "data", "music", "musiclibrary.dat"), "utf-8");
    const decompress = fflate.unzlibSync(Buffer.from(info, "base64url"));

    return fflate.strFromU8(decompress);
}

export function addDataToMusicLibrary(song: songInfoObj, artist: artistInfoObj) {
    const info = getDataFromMusicLibrary().split("|");

    const version = parseInt(info[0]);
    const artists = info[1].split(";");
    const songs = info[2].split(";");
    const tags = info[3];

    const songData = Object.values(song);
    songData[5] = `.${songData[5]}.`;

    const artistData = Object.values(artist);
    artistData.push(" ", " ");

    if (!artists.includes(artistData.join(","))) {
        artists[0] ? artists.push(artistData.join(",")) : artists[0] = artistData.join(",");
    }

    songs[0] ? songs.push(songData.join(",")) : songs[0] = songData.join(",");

    const newInfo = [
        version + 1,
        artists.join(";"),
        songs.join(";"),
        tags
    ].join("|");

    const compressedData = fflate.zlibSync(fflate.strToU8(newInfo));

    writeFileSync(path.join(__dirname, "../../", "data", "music", "musiclibrary.dat"), Buffer.from(compressedData).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"));
    writeFileSync(path.join(__dirname, "../../", "data", "music", "musiclibrary_version.txt"), String(version + 1));
}

// eJwzrKmpMdSJzC8NKU1KtTbS8UstTy_KL81LKQYAfOYJlQ==