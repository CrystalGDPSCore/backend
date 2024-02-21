import { Buffer } from "buffer";
import * as crypto from "crypto";
import * as bcrypt from "bcrypt";

import { Salts } from "../helpers/enums";

export function generateUuid() {
    return crypto.randomUUID();
}

export function base64Encode(str: string) {
    return Buffer.from(str).toString("base64");
}

export function base64Decode(str: string) {
    return Buffer.from(str).toString("ascii");
}

export function hashGdObj(str: string, salt: Salts) {
    const hash = crypto.createHash("sha1").update(`${str}${salt}`, "utf-8").digest("hex");
    
    return hash;
}

export function hashGdLevel(levelData: string) {
    const level = Math.floor(levelData.length / 40);

    let data = "";
    for (let i = 0; i < 40; i++) {
        data += levelData[i * level];
    }

    const hash = crypto.createHash("sha1").update(`${data}${Salts.Level}`, "utf-8").digest("hex");

    return hash;
}

export function hashPassword(password: string) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
}

export function decodeGjp2(password: string) {
    const gjp2 = hashGdObj(password, Salts.RegisterUser);
    
    return hashPassword(gjp2);
}

export function checkUserGjp2(gjp2: string, hashedPassword: string) {
    return bcrypt.compareSync(gjp2, hashedPassword);
}