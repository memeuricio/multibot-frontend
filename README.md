# WatoncitaMC · Panel de Administración de Bots

Frontend para administrar la flota de bots de Minecraft (WatoncitaMC Bot API) e
integrar el mapa interactivo del servidor ([squaremap](https://github.com/jpenilla/squaremap)).

## Funcionalidades

- **Acceso por token**: la API se protege con `X-API-Key`; el token vive solo en
  `localStorage` del navegador (`botapi_key`).
- **Resumen**: salud del servicio, contadores de bots por estado y jugadores
  conectados al servidor (en vivo).
- **Bots**: dashboard con polling automático (5 s), filtros, conectar /
  desconectar / eliminar, y badge de autenticación (login) por bot.
- **Crear bot**: validación client-side (host, puerto, username `^[A-Za-z0-9_]{1,16}$`,
  versión 26.1/26.2, distancia de vista 2-32) y **contraseña opcional** para
  el plugin de login del servidor (auto `/login` y `/register`).
- **Detalle del bot**: telemetría (posición, vida, comida, ping, protocolo,
  modo de juego), estado de autenticación con avisos de error, polling
  adaptativo (2.5 s conectando / 5 s online) y **chat en vivo** (polling cada 2 s).
- **Mapa**: visor squaremap embebido con selector de mundos, lista de jugadores
  en vivo, pantalla completa y apertura en pestaña nueva.

## Puesta en marcha

```bash
pnpm install
pnpm dev      # desarrollo
pnpm build    # producción
pnpm lint     # eslint
```

## Login automático de bots (`/login` · `/register`)

Los servidores con plugin de login (AuthMe, nLogin, LibreLogin…) exigen que
cada jugador se autentique al entrar. Al crear un bot puedes indicar la
**contraseña del bot** (opcional) y el backend:

1. Detecta el aviso del plugin al entrar al servidor.
2. Envía `/register <contraseña> <contraseña>` la primera vez (cuenta nueva)
   o `/login <contraseña>` si ya está registrado.
3. Corrige solo si el servidor responde lo contrario, y expone el avance en
   `auth` (`pending`, `login_sent`, `register_sent`, `logged_in`,
   `not_required`, `timeout`, `error`) — el panel lo muestra como badge.

La contraseña nunca se devuelve por la API: viaja solo al crear el bot y vive
en memoria del backend. Si no pones contraseña, el bot no intenta login.

## Variables de entorno (`.env`)

```bash
VITE_BOT_API_URL=https://tienda.memeuricio.dev  # API de bots (prod)
VITE_MAP_PROXY_PATH=/squaremap                  # Ruta proxy del mapa squaremap
```

## Mapa en producción (proxy same-origin)

El mapa se consume por la ruta `/squaremap` del **mismo dominio del panel**;
esto evita el bloqueo por CORS (dev) y mixed content (prod HTTPS). El
reverse proxy debe **quitar el prefijo** y reenviar a `http://35.225.251.194:8080`.

**Nginx**

```nginx
location /squaremap/ {
    proxy_pass http://35.225.251.194:8080/;  # la barra final elimina el prefijo
    proxy_set_header Host $host;
}
```

**Traefik (Dokploy) — labels del contenedor/routeador**

```yaml
- traefik.enable=true
- traefik.http.routers.squaremap.rule=Host(`mine.memeuricio.dev`) && PathPrefix(`/squaremap`)
- traefik.http.routers.squaremap.middlewares=squaremap-strip
- traefik.http.middlewares.squaremap-strip.stripprefix.prefixes=/squaremap
- traefik.http.services.squaremap.loadbalancer.server.port=8080
```

**Caddy**

```caddy
mine.memeuricio.dev {
    handle_path /squaremap/* {
        reverse_proxy http://35.225.251.194:8080
    }
    # ... resto del panel
}
```

Si prefieres consumo directo sin proxy, define `VITE_MAP_PROXY_PATH` con la
URL absoluta del mapa (requiere que squaremap envíe CORS y que el panel no
esté en HTTPS).

## Token de acceso

El backend solo guarda el SHA-256 del token (`ADMIN_KEY_HASH`); el token plano
se ingresa en la pantalla de acceso.

```powershell
# Generar token + hash (Windows PowerShell)
$rng=[Security.Cryptography.RandomNumberGenerator]::Create(); $b=[byte[]]::new(32); $rng.GetBytes($b); ($b|%{$_.ToString('x2')})-join''
$sha=[Security.Cryptography.SHA256]::Create(); ($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes('PEGA_EL_TOKEN_AQUI'))|%{$_.ToString('x2')})-join''
```

- Token → pantalla de acceso del panel.
- Hash → variable `ADMIN_KEY_HASH` del backend.

> Nota: requiere HTTPS en producción; con HTTP el header viaja en claro.
