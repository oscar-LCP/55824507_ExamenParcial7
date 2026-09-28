const http = require("http");
const fs = require("fs/promises");
const path = require("path");

const PORT = process.env.PORT || 3000;
const PUBLIC_PATH = path.join(__dirname, "..", "public");

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml"
};

const server = http.createServer(async (req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
        res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Método no permitido");
        return;
    }

    try {
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const pathname = decodeURIComponent(parsedUrl.pathname);
        const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
        const fullPath = path.resolve(PUBLIC_PATH, relativePath);

        if (!fullPath.startsWith(`${PUBLIC_PATH}${path.sep}`)) {
            res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Acceso denegado");
            return;
        }

        const content = await fs.readFile(fullPath);
        const contentType = MIME_TYPES[path.extname(fullPath)] || "application/octet-stream";

        res.writeHead(200, { "Content-Type": contentType });
        res.end(req.method === "HEAD" ? undefined : content);
    } catch (error) {
        const statusCode = error.code === "ENOENT" ? 404 : error instanceof URIError ? 400 : 500;
        res.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(statusCode === 404 ? "Archivo no encontrado" : "No se pudo procesar la solicitud");
    }
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});