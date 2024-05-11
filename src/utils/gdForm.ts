export function gdObjToString(obj: Record<number, any>, sep: string = ":") {
    let responseString: string[] = [];

    for (const [key, value] of Object.entries(obj)) {
        responseString.push(`${key}${sep}${value}`);
    }
    return responseString.join(sep);
}

export function stringToGdObj(data: string, sep: string = ":") {
    const entries = data.split(sep);
    let result = [];

    while (entries.length) {
        result.push(entries.splice(0, 2));
    }

    return Object.fromEntries(result);
}

export function getDifficultyFromStars(stars: number) {
    switch (stars) {
        case 2:
            return "Easy";
        case 3:
            return "Normal";
        case 4:
        case 5:
            return "Hard";
        case 6:
        case 7:
            return "Harder";
        case 8:
        case 9:
            return "Insane";
        case 10:
            return "Demon";
        default:
            return "Auto";
    }
}