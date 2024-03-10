import { Buffer } from "buffer";

import * as crypto from "crypto";
import * as bcrypt from "bcrypt";
import * as itertools from "itertools";

import { Salts } from "../helpers/enums";

export function generateUuid() {
    return crypto.randomUUID();
}

export function xor(str: string, key: number) {
    let result = "";
    
    for (const [strChar, keyChar] of itertools.zip(str, itertools.cycle(String(key)))) {
        result += String.fromCharCode(strChar.charCodeAt(0) ^ keyChar.charCodeAt(0));
    }

    return result;
}

export function base64Encode(str: string) {
    return Buffer.from(str).toString("base64");
}

export function base64Decode(str: string) {
    return Buffer.from(str, "base64").toString();
}

export function safeBase64Encode(str: string) {
    return base64Encode(str).replace(/\+/g, "-").replace(/\//g, "_");
}

export function safeBase64Decode(str: string) {
    return base64Decode(str.replace(/\-/g, "+").replace(/\_/g, "/"));
}

export function hashGdObj(str: string, salt: Salts) {
    const hash = crypto.createHash("sha1").update(`${str}${salt}`).digest("hex");
    
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