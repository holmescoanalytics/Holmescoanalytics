/**
 * Watson — Proxy de IA (Vercel Serverless Function)
 * --------------------------------------------------
 * Ruta pública: https://TU-PROYECTO.vercel.app/api/chat
 *
 * Recibe las peticiones del frontend (Tutor IA y Simulacro de Entrevista),
 * agrega la API key de Anthropic de forma SEGURA (vive en el servidor,
 * nunca viaja al navegador) y reenvía la respuesta. Resuelve CORS.
 *
 * La API key NO se escribe aquí. Se guarda como Environment Variable en
 * Vercel con el nombre ANTHROPIC_API_KEY (ver pasos en el chat).
 */

const ALLOWED_ORIGINS = [
  "https://holmescoanalytics.github.io",
  "http://localhost:8000",
  "http://127.0.0.1:5500"
];

function setCors(req, res) {
  const origin = req.headers.origin || "";
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.setHeader("Access-Control-Allow-Origin", allow);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", "86400");
}

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Diagnóstico temporal: GET dice si la key llega a la función (sin revelarla)
  if (req.method === "GET") {
    const k = process.env.ANTHROPIC_API_KEY || "";
    return res.status(200).json({
      keyPresent: k.length > 0,
      keyLength: k.length,
      startsWith: k.slice(0, 7),
      node: process.version
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});

    const payload = {
      model: body.model || "claude-sonnet-4-20250514",
      max_tokens: Math.min(body.max_tokens || 1000, 1500),
      system: typeof body.system === "string" ? body.system : "",
      messages: Array.isArray(body.messages) ? body.messages : []
    };

    const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(payload)
    });

    const data = await apiRes.text();
    res.setHeader("Content-Type", "application/json");
    return res.status(apiRes.status).send(data);
  } catch (err) {
    return res.status(500).json({ error: "Proxy error", detail: String(err) });
  }
}
