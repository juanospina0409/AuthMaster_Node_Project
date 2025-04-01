import type { IncomingMessage } from "http"
import { StringDecoder } from "string_decoder"

/**
 * Parses the body of an incoming HTTP request and returns it as a JavaScript object.
 *
 * @param req - The incoming HTTP request object of type `IncomingMessage`.
 * @returns A promise that resolves with the parsed body as a JavaScript object,
 *          or rejects with an error if the body cannot be parsed as JSON.
 *
 * @example
 * ```typescript
 * import { parseBody } from './utils/parseBody';
 * 
 * const body = await parseBody(req);
 * console.log(body); // Parsed JSON object
 * ```
 */
export const parseBody = (req: IncomingMessage): Promise<any> => {
    return new Promise((resolve, reject) => {
        const decoder = new StringDecoder("utf-8")
        let buffer = ""

        req.on("data", (chunk) => {
            buffer += decoder.write(chunk)
        })
        req.on("end", () => {
            buffer += decoder.end()

            try {
                resolve(JSON.parse(buffer))
            } catch (err) {
                reject(err)
            }
        })
    })
}