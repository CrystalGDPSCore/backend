export function getRelativeTime(date: Date) {
    const timeDifference = Math.floor((Date.now() - date.getTime()) / 1000);

    const units = {
        year: 24 * 60 * 60 * 365,
        month: 24 * 60 * 60 * 365 / 12,
        day: 24 * 60 * 60,
        hour: 60 * 60,
        minute: 60,
        second: 1,
    };

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "always" });

    for (const [unit, seconds] of Object.entries(units)) {
        if (timeDifference >= seconds || unit == "second") {
            const time = rtf.format(-(Math.floor(timeDifference / seconds)), unit as Intl.RelativeTimeFormatUnit).slice(0, -4);

            if (time == "0 seconds") {
                return "1 second";
            }

            return time;
        }
    }

    return "undefined seconds";
}