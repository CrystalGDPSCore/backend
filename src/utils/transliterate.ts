import { createSlug } from "speakingurl";
import { normalizeUnicodeText } from "normalize-unicode-text";

const slug = createSlug({
    separator: " ",
    maintainCase: true,
    symbols: false,
    custom: [
        "'", "[", "]", "(", ")",
        "/", "\"", "1", "2", "3", // add more symbols
        "4", "5", "6", "7", "8",
        "9", "0", ".", "~"
    ]
});

export default function transliterate(str: string) {
    return slug(normalizeUnicodeText(str));
}