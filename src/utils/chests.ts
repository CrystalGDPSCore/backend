import { ChestType, ShardType } from "../helpers/enums";

import { chests } from "../config.json";

const keyItem = 6;

export function getChestStuff(chestType: keyof typeof ChestType) {
    const chest = chestType == "Small" ? chests.small : chests.big;

    const orbs = Math.floor(Math.random() * (chest.orbs[1] - chest.orbs[0] + 1)) + chest.orbs[0];
    const diamonds = Math.floor(Math.random() * (chest.diamonds[1] - chest.diamonds[0] + 1)) + chest.diamonds[0];

    const itemType = Object.keys(ShardType).map(n => parseInt(n)).filter(n => !isNaN(n));

    let items = [0, 0];

    if (Math.random() < chest.shardChance) {
        items[0] = Math.random() < chest.keyChance ? keyItem : itemType[Math.floor(Math.random() * itemType.length)];

        if (Math.random() < (chest.shardChance / 2)) {
            items[1] = itemType[Math.floor(Math.random() * itemType.length)];
        }
    }

    const chestStuff = [
        orbs,
        diamonds,
        ...items
    ].join(",");

    return chestStuff;
}