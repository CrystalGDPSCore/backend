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