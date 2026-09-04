# MineGo · Panel de Administración de Bots

Frontend para administrar la flota de bots de Minecraft (MineGo Bot API) e
integrar el mapa interactivo del servidor ([squaremap](https://github.com/jpenilla/squaremap)).

## Funcionalidades

- **Acceso por token**: la API se protege con `X-API-Key`; el token vive solo en
  `localStorage` del navegador (`botapi_key`).
- **Resumen**: salud del servicio, contadores de bots por estado y jugadores
  conectados al servidor (en vivo).
- **Bots**: dashboard con polling automático (5 s), filtros, conectar /
  desconectar / eliminar.
- **Crear bot**: validación client-side (host, puerto, username `^[A-Za-z0-9_]{1,16}$`,
  versión 26.1/26.2, distancia de vista 2-32).
- **Detalle del bot**: telemetría (posición, vida, comida, ping, protocolo,
  modo de juego), polling adaptativo (2.5 s conectando / 5 s online) y **chat
  en vivo** (polling cada 2 s).
- **Mapa**: visor squaremap embebido con selector de mundos, lista de jugadores
  en vivo, pantalla completa y apertura en pestaña nueva.

## Puesta en marcha

```bash
pnpm install
pnpm dev      # desarrollo
pnpm build    # producción
pnpm lint     # eslint
```

## Variables de entorno (`.env`)

```bash
VITE_BOT_API_URL=http://localhost:8080        # API de bots (prod: https://tienda.memeuricio.dev)
VITE_MAP_URL=http://35.225.251.194:8080       # Mapa squaremap del servidor
```

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
