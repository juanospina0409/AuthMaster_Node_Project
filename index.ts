import cors from "cors" //sirve para poder aplicar diferentes dominios
import {createServer} from "http"
import { authRouter, characterRouter } from "./routes"
import { config } from "./config"

const corsMiddleware = cors()

const server = createServer(async (req, res) => {
    corsMiddleware(req, res, async () => {
        res.setHeader("Content-Type", "application/json")

        try {
            if (req.url?.startsWith("/auth")) {
                await authRouter(req, res)
            } else if (req.url?.startsWith("/characters")) {
                await characterRouter(req, res)
            } else {
                res.statusCode = 404
                res.end(JSON.stringify({message: `Endpoint not found: ${req.url}`}))
            }

        } catch(_err) {
            res.statusCode = 500
            // console.error("Error occurred:", _err)
            res.end(JSON.stringify({message: "Internal Server Error"}))
        }
    })
})

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})
