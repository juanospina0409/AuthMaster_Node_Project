import type { IncomingMessage, ServerResponse } from "http";
import { verify, type JwtPayload } from "jsonwebtoken";
import { isTokenRevoked } from "../models";
// import { verify } from "crypto"
import { config } from "../config";

export interface AuthenticatedRequest extends IncomingMessage {
    user?: JwtPayload | string
}

/**
 * Authenticates a request by validating the provided token in the `Authorization` header.
 * 
 * @param req - The incoming request object, which must include an `authorization` header.
 * @param res - The server response object used to send error responses if authentication fails.
 * @returns A promise that resolves to `true` if the token is valid and the user is authenticated,
 *          or `false` if the token is missing, revoked, or invalid.
 * 
 * @throws Will not throw an error but will handle invalid tokens by sending appropriate HTTP responses:
 *         - 401 Unauthorized: If the token is missing.
 *         - 403 Forbidden: If the token is revoked or invalid.
 */
export const AuthenticatedToken = async (
    req: AuthenticatedRequest,
    res: ServerResponse
): Promise<boolean> => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    //["Bearer", "alksdfjlaoierwhtlioajdsflgkjadfslgk"]
    if (!token) {
        res.statusCode = 401;
        res.end(JSON.stringify({message: "Unauthorized", reason: "Token doesn't exist."}));
        return false;
    }
    if (isTokenRevoked(token)) {
        res.statusCode = 403;
        res.end(JSON.stringify({message: "Forbidden", reason: "Token has been revoked."}));
        return false;
    }
    try {
        const decoded = verify(token, config.jwtSecret);
        req.user = decoded;
        return true;
    } catch (_err) {
        res.statusCode = 403;
        res.end(JSON.stringify({message: "Forbidden", reason: "Token has been revoked."}));
        return false;
    }
}

