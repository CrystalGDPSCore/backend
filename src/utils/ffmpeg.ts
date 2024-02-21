import path from "path";
import internal from "stream";

import ffmpeg from "fluent-ffmpeg";

ffmpeg.setFfmpegPath(path.join(__dirname, "../../ffmpeg/bin/ffmpeg.exe"));

export default async function convertToMp3(audioStream: internal.Readable, convertedFileName: string) {
    return await new Promise((resolve) => {
        ffmpeg(audioStream)
            .noVideo()
            .audioCodec("libmp3lame")
            .audioBitrate(128)
            .save(`data/songs/${convertedFileName}.mp3`)
            .on("end", () => {
                resolve(true);
            });
    });
}