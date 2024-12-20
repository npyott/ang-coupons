import { readFileSync } from "fs";

try {
    const data = readFileSync(".env").toString();

    const keyValuePairs = data
        .split("\n")
        .filter((line) => line.includes("="))
        .map((line) => {
            const [key, value] = line
                .split("=")
                .map((s) => s.trim())
                .map((s) =>
                    s.startsWith('"') && s.endsWith('"') ? s.slice(1, -1) : s
                );

            return [key, value];
        });

    for (const [key, value] of keyValuePairs) {
        process.env[key] = value;
    }
} catch (_) {}

export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
export const AWS_DYNAMODB_TABLE_NAME = process.env.AWS_DYNAMODB_TABLE_NAME;
