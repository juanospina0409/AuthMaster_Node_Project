/**
 * Enum que representa los métodos especificos de solicitud HTTP comúnmente utilizados en el desarrollo web.
 */
export enum HttpMethod {
    "GET" = "GET", // Recupera datos de un servidor (operación de solo lectura).
    "POST" = "POST", // Envía datos para crear un nuevo recurso.
    "PUT" = "PUT", // Actualiza un recurso existente o crea uno nuevo si no existe.
    "DELETE" = "DELETE", // Elimina un recurso del servidor.
    "PATCH" = "PATCH", // Aplica modificaciones parciales a un recurso.
    "HEAD" = "HEAD", // Recupera solo los encabezados de un recurso.
    "OPTIONS" = "OPTIONS", // Describe las opciones de comunicación disponibles.
    "CONNECT" = "CONNECT", // Establece un túnel hacia el servidor.
    "TRACE" = "TRACE" // Realiza un seguimiento de la ruta de una solicitud.
}
