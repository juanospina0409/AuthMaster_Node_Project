/**
 * evn - Todo lo que va ligado al environment, env no se sube al repositorio porque se puede leer, se usa en el servidor de hosting
 */
export const config = {
    jwtSecret: Buffer.from(process.env.JWT_SECRET || "My_Secret_Key", "utf-8").toString("base64"),
    port: Number(process.env.PORT) || 4000
};