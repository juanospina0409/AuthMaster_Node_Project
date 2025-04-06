import type { ServerResponse } from "http"
import type { AuthenticatedRequest } from "./authentication"
import type { User } from "../models"

/**
 * Middleware function to authorize user roles.
 * 
 * This function checks if the authenticated user's role is included in the allowed roles.
 * If the user's role is not authorized, it sends a 403 Forbidden response.
 * 
 * @param {...string[]} roles - The list of roles that are allowed to access the resource.
 * @returns {Promise<(req: AuthenticatedRequest, res: ServerResponse) => boolean>} 
 *          A function that takes an authenticated request and server response, 
 *          and returns a promise resolving to a boolean indicating whether the user is authorized.
 * 
 * @example
 * // Usage in an Express route
 * app.get('/admin', authorizeRoles('admin'), (req, res) => {
 *     res.send('Welcome Admin');
 * });
 */
export const authorizeRoles = (...roles: string[]) => {
    return async (
        req: AuthenticatedRequest,
        res: ServerResponse,
    ): Promise<boolean> => {

        if (!req.user) {
            console.warn("❗ req.user no está definido.");
            res.statusCode = 401
            res.end(JSON.stringify({ message: "Unauthorized: No user info" }))
            return false
        }

        const userRole = (req.user as User).role
        console.log("🔍 Rol detectado:", userRole);

        if (!userRole || !roles.includes(userRole)) {
            console.log("⛔ Acceso denegado: Rol no autorizado");
            res.statusCode = 403
            res.end(JSON.stringify({ message: "Forbidden: Role not allowed" }))
            return false
        }
        console.log("✅ Acceso permitido");
        return true
    }
}