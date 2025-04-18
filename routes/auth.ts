import type { IncomingMessage, ServerResponse } from "http";
import { addRevokeToken, authSchema, createUser, findUserByEmail, HttpMethod, validatePassword, revokeUserToken, Role } from "../models";
import { parseBody } from "../utils/parseBody";
import { safeParse } from "valibot";
import { config } from "../config";
import type { AuthenticatedRequest } from "../middleware/authentication";
import { sign } from "jsonwebtoken";

export const authRouter = async (req: IncomingMessage, res: ServerResponse) => {

    console.log("➡️ Nueva solicitud:", req.method, req.url);
    const path = req.url?.split("?")[0]; // Normalizar la URL
    console.log("📌 URL Procesada:", path);


    const {method} = req

    console.log("📌 Método recibido:", method); // Agregar log
    if (path === "/auth/register" && method === HttpMethod.POST) {
        console.log(`✅ Ruta encontrada: ${method} ${path}`);
        const body = await parseBody(req)
        console.log("📩 Body recibido:", body);
        const result = safeParse(authSchema, body)

        if(result.issues) {
            res.statusCode = 400
            res.end(JSON.stringify({message: "Bad Request"}))
            return
        }

        // Validar el rol, si especificamente se asigna el rol de 'admin' se registram como administrador, de lo contrario como usuario
        const role = body.role === "admin" ? Role.ADMIN : Role.USER

        try {
            const user = await createUser(body.email, body.password, role)
            console.log("✅ Usuario creado:", user);
            res.statusCode = 201
            res.end(JSON.stringify(user))
            return
        } catch (err) {
            console.error("❌ Error al crear usuario:", err);
            if (err instanceof Error) {
                res.end(JSON.stringify({message: err.message}))
            }
            else {
                res.end(JSON.stringify({message: "Internal Server Error"}))
            }
            return
        }
    }
    if (path === "/auth/login" && method === HttpMethod.POST) {
        console.log(`✅ Ruta encontrada: ${method} ${path}`);
        const body = await parseBody(req)
        console.log("📩 Body recibido:", body);
        const result = safeParse(authSchema, body)
        if (result.issues) {
            res.end(JSON.stringify({message: "Bad Request"}))
        }

        const {email, password } = body
        const user = findUserByEmail(email)
        
        if (!user || !(await validatePassword(user, password))) {
            res.statusCode = 401
            res.end(JSON.stringify({message: "Invalid Email or Password"}))
            return
        } else {
            console.log("✅ Usuario encontrado:", user);
        }
        console.log("🛠️ Clave secreta en auth.ts: ", config.jwtSecret);
        const accessToken = sign(
            {id: user.id, email: user.email, role: user.role},
            config.jwtSecret,
            {expiresIn: "1h"}
        )
        const refreshToken = sign(
            {id: user.id},
            config.jwtSecret,
            {expiresIn: "24h"}
        )

        user.refreshToken = refreshToken
        res.end(JSON.stringify({accessToken, refreshToken}))
        return
    }
    if (path === "/auth/logout" && method === HttpMethod.POST) {
        console.log(`✅ Ruta encontrada: ${method} ${path}`);
        const token = req.headers["authorization"]?.split(" ")[1];
        if (token) {
            addRevokeToken(token)

            const formattedReq = req as AuthenticatedRequest
            if (formattedReq.user && typeof formattedReq.user === "object" && "id" in formattedReq.user) {
                const result = revokeUserToken(formattedReq.user.email)
                if (!result) {
                    res.statusCode = 403
                    res.end(JSON.stringify({Message: "Forbidden"}))
                }
            }
            console.log("✅ Token Revocado:", token);
            res.end(JSON.stringify({Message: "Logged out"}))
            return
        }
    }

    console.log("❌ Ruta no encontrada:", req.method, req.url);
    res.statusCode = 404
    res.end(JSON.stringify({Message: "Endpoint Not Found"}))
}