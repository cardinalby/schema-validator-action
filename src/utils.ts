export function isValidHttpUrl(str: string): boolean {
    try {
        const url = new URL(str);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
        return false;
    }
}