/**
 * evn - Todo lo que va ligado al environment, env no se sube al repositorio porque se puede leer, se usa en el servidor de hosting
 */
export const config = {
    jwtSecret: process.env.JWT_SECRET as string || "My_Secret_Key",
    port: process.env.PORT as string || 4000
}

export default config