import { AuthenticatedToken, type AuthenticatedRequest } from '../middleware/authentication';
import { authorizeRoles } from '../middleware/autorization';
import { addCharacter, CharacterShema, deleteCharacter, getAllCharacters, getCharacterById, HttpMethod, Role, updateCharacter, type Character } from '../models';
import type { IncomingMessage, ServerResponse } from 'http';
import { parseBody } from '../utils/parseBody';
import { safeParse } from 'valibot';

export const characterRouter = async (
    req: IncomingMessage,
    res: ServerResponse
) => {

    console.log("➡️ Nueva solicitud:", req.method, req.url); //new
    const path = req.url?.split("?")[0]; // Normaliza la URL new
    console.log("📌 URL Procesada:", path); // new
    const { method } = req

    if (!(await AuthenticatedToken(req as AuthenticatedRequest, res))) {
        res.statusCode = 401;
        res.end(JSON.stringify({ message: "Unauthorized" }));
        return;
    }

    if (path === "/characters" && method === HttpMethod.GET) {
        console.log(`✅ Ruta encontrada1: ${method} ${path}`);
    
        // Validar el token antes de continuar
        const isAuthenticated = await AuthenticatedToken(req, res);
        if (!isAuthenticated) {
            console.log("❌ Usuario no autenticado");
            return;
        }
    
        // Si el usuario está autenticado, obtenemos los personajes
        const characters = getAllCharacters();
        
        res.statusCode = 200;
        res.end(JSON.stringify(characters.length > 0 ? characters : []));
        return;
    }

    
    if (path === "/characters/" && method === HttpMethod.GET) {
        console.log(`✅ Ruta encontrada2: ${method} ${path}`);
        const id = parseInt(path.split("/").pop() as string, 10)
        const character = getCharacterById(id)

        if (!character) {
            res.statusCode = 404
            res.end(JSON.stringify({ message: "Character not found!" }))
            return
        }

        res.statusCode = 200
        res.end(JSON.stringify(character))
        return
    }

    if (path === "/characters" && method === HttpMethod.POST) {
        console.log(`✅ Ruta encontrada3: ${method} ${path}`);

        const isAuthenticated = await AuthenticatedToken(req as AuthenticatedRequest, res)
        if (!isAuthenticated) {
            res.statusCode = 401
            res.end(JSON.stringify({ message: "Unauthorized" }))
            return
        }

        try {
            const isAuthorized = await authorizeRoles(Role.ADMIN, Role.USER)(
                req as AuthenticatedRequest, 
                res as ServerResponse
            )

            if (!isAuthorized) {
                res.statusCode = 403
                res.end(JSON.stringify({message: "Forbidden"}))
                return
            }

        } catch (authErr) {
            console.error("❌ Error en authorizeRoles:", authErr)
            res.statusCode = 500
            res.end(JSON.stringify({message: "Internal Error in authorization"}))
            return
        }

        const body = await parseBody(req)
        console.log("📦 Body recibido:", body)

        const result = safeParse(CharacterShema, body)
        if (result.issues) {
            res.statusCode = 400
            res.end(JSON.stringify({message: result.issues}))
            console.log("❌ Errores de validación:", result.issues)
            return
        }

        const character: Character = body
        const newCharacter = addCharacter(character)

        res.statusCode = 201
        res.end(JSON.stringify(newCharacter))
        return
    }

    if (path?.startsWith("/characters/") && method === HttpMethod.PATCH) {
        if (!(await authorizeRoles(Role.ADMIN)(req as AuthenticatedRequest, res))) {
            res.statusCode = 403
            res.end(JSON.stringify({message: "Forbidden"}))
            return
        }
        
        const id = parseInt(path.split("/").pop() as string, 10)
        const body = await parseBody(req)
        const character: Character = body
        const updatedCharacter = updateCharacter(id, character)

        if (!updatedCharacter) {
            res.statusCode = 404
            res.end(JSON.stringify({message: "Character not found"}))
        } else {
            res.statusCode = 200
            res.end(JSON.stringify({updatedCharacter}))
        }

        return
    }

    if (path?.startsWith("/characters/") && method === HttpMethod.DELETE) {
        if (!(await authorizeRoles(Role.ADMIN)(req as AuthenticatedRequest, res))) {
            res.statusCode = 403
            res.end(JSON.stringify({message: "Forbidden"}))
            return
        }

        const id = parseInt(path.split("/").pop() as string, 10)
        const success = deleteCharacter(id)

        if(!success) {
            res.statusCode = 404
            res.end(JSON.stringify({message: "Character not found"}))
        } else {
            res.statusCode = 204
            res.end(JSON.stringify({message: "Character deleted succesful"}))
        }
        return
    }
    res.statusCode = 404
    res.end(JSON.stringify({message: "Endpoint Not found"}))
}
