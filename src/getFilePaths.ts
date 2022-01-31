import {glob} from "glob";

export async function getFilePaths(fileInput: string): Promise<string[]> {
    const parts = fileInput.split('|');
    const matchesPromises: Promise<string[]>[] = [];
    for (let part of parts) {
        matchesPromises.push(
            new Promise((resolve, reject) => glob(part, (err, matches) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(matches);
                }
            }))
        );
    }
    const matches = await Promise.all(matchesPromises);
    return matches.flat();
}