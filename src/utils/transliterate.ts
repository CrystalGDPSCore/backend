import { createSlug } from "speakingurl";
import { normalizeUnicodeText } from "normalize-unicode-text";

const slug = createSlug({
    separator: " ",
    maintainCase: true,
    symbols: false,
    custom: [
        "!", "\"", "#", "$",
        "%", "&", "'", "(",
        ")", "*", "+", ",",
        "-", ".", "/", ":",
        ";", "<", "=", ">",
        "?", "@", "[", "\\",
        "]", "^", "_", "`",
        "{", "|", "}", "~",
        "0", "1", "2", "3",
        "4", "5", "6", "7",
        "8", "9"
    ]
});

export default function transliterate(text: string) {
    return slug(normalizeUnicodeText(text));
}