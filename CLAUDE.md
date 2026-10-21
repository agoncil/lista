# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Preferencias del usuario

- Responder siempre en español.

## Qué es este repositorio

No hay código: el repo contiene solo una lista de reproducción IPTV en formato M3U (`MOVISTAR.m3u`) con canales de Movistar+ servidos por multicast. No hay build, lint ni tests.

## Formato de `MOVISTAR.m3u`

- Primera línea: cabecera `#EXTM3U` con `url-tvg` apuntando a la guía EPG externa (`https://raw.githubusercontent.com/dracohe/CARLOS/master/guide_IPTV.xml`). Los nombres de canal deben coincidir con esa guía para que se asocie la programación.
- Cada canal ocupa dos líneas:
  ```
  #EXTINF:-1, [NNN] Nombre del canal {DRM}
  rtp://@239.0.X.Y:8208
  ```
  - `[NNN]` es el dial del canal con tres dígitos; la lista está ordenada por dial.
  - `{DRM}` marca los canales cifrados (no se reproducen en reproductores sin soporte DRM).
  - La URL es multicast RTP (`239.0.x.x`, puerto `8208`), así que solo funciona dentro de la red de Movistar (con IPTV/udpxy configurado); no se puede comprobar desde esta sesión en la nube.
- Una línea en blanco separa bloques temáticos (p. ej. cine `0xx` hasta el 029 y series desde el 031).
- El archivo no termina en salto de línea; al editar el final, conviene mantener el formato de dos líneas por canal.
