export function gdObjToString(obj: { [ key: number ]: any }, sep: string = ":") {
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

export function getShownIcon(iconType: number) {
    switch (iconType) {
        case 1:
            return "Ship";
        case 2:
            return "Ball";
        case 3:
            return "Ufo";
        case 4:
            return "Wave";
        case 5:
            return "Robot";
        case 6:
            return "Spider";
        case 7:
            return "Swing";
        case 8:
            return "Jetpack"
        default:
            return "Cube";
    }
}