# EQ Proxy

Serverless proxy for English Quest PWA → Anthropic API.

## Deploy to Vercel

1. Sube esta carpeta a un repo GitHub (ej. `eq-proxy`)
2. Ve a vercel.com → New Project → importa el repo
3. En **Environment Variables** agrega:
   - Name: `ANTHROPIC_API_KEY`
   - Value: tu API key de Anthropic
4. Deploy

Tu endpoint quedará en:
`https://eq-proxy.vercel.app/api/anthropic`

## Uso

El proxy recibe el mismo body que la API de Anthropic y lo reenvía con la key segura en el servidor.
