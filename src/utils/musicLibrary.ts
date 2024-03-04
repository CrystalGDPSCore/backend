import path from "path";
import { writeFileSync, readFileSync } from "fs";

import fflate from "fflate";

function getInfoFromMusicLibrary() {
    const info = readFileSync(path.join(__dirname, "../../", "data", "music", "musiclibrary.dat"), "utf-8");
    const decompress = fflate.unzlibSync(Buffer.from(info, "base64url"));

    return fflate.strFromU8(decompress);
}

export default function addDataToMusicLibrary(song: (string | number)[], artist: (string | number)[]) {
    const info = getInfoFromMusicLibrary().split("|");

    const version = Number(info[0]);
    const artists = info[1].split(";");
    const songs = info[2].split(";");
    const tags = info[3];

    if (!artists.includes(artist.join(","))) {
        if (!artists[0]) {
            artists[0] = artist.join(",");
        } else {
            artists.push(artist.join(","));
        }
    }

    if (!songs[0]) {
        songs[0] = song.join(",");
    } else {
        songs.push(song.join(","));
    }

    const newInfo = `${version + 1}|${artists.join(";")}|${songs.join(";")}|${tags}`;
    const compressedData = fflate.zlibSync(fflate.strToU8(newInfo));

    writeFileSync(path.join(__dirname, "../../", "data", "music", "musiclibrary.dat"), Buffer.from(compressedData).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"));
    writeFileSync(path.join(__dirname, "../../", "data", "music", "musiclibrary_version.txt"), String(version + 1));
}

// eJwzrKmpMdSJzC8NKU1KtTbS8UstTy_KL81LKQYAfOYJlQ==