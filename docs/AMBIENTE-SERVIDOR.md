# Ambiente del Servidor - red.cheosys.com

**Fecha:** 2026-06-27
**Servidor:** cheosys-core-prod-01.camicandies.com
**IP:** 144.126.132.31

## Sistema Operativo
- Ubuntu 22.04.5 LTS (Jammy)
- Kernel: Linux 5.15.0-153-generic
- Arquitectura: x86_64

## Recursos
- **Disco:** 46GB disponibles de 96GB (50% uso)
- **RAM:** 2.2GB libre de 3.8GB total
- **CPU:** 4 cores AMD EPYC

## Servicios Activos
- **Nginx:** v1.18.0 (puertos 80, 443)
- **Node.js:** v18.20.8
- **PM2:** v6.0.6
- **Certbot:** v1.21.0 (renovación automática)
- **Docker:** Varios containers activos
- **MariaDB:** 10.6.23 (localhost:3306)

## Sitios Existentes en Nginx
- arconte.cheosys.com → localhost:4000
- camicandies.com → localhost:8443
- cheosys.com → estático

## Puertos en Uso
- 22 (SSH)
- 80 (HTTP)
- 443 (HTTPS)
- 3000 (Docker - atlas-wikijs)
- 3306 (MariaDB)
- 4000 (arconte-prod)
- 5678 (Docker - n8n)
- 8081 (Docker - espocrm)
- 8082 (Docker - freescout)
- 8443 (camicandies)

## Puerto 3001: ✅ LIBRE para red.cheosys.com

## PM2 - Procesos
- arconte-prod (ID 5): online, puerto 4000
- cannanext (ID 0): stopped → **Será reutilizado**
- ghost-judge (ID 6): online
- usa-transmitter (ID 7): online

## Usuario
- cheo-admin-core con sudo sin password
- Grupos: sudo, docker, cheosysbot
- Permisos de escritura en /opt/cheosys/

## Firewall (UFW)
- Activo, deny incoming por defecto
- Permite: 22, 80, 443
- 4000 solo desde 149.104.78.34

## Notas Importantes
- NO tocar configuraciones existentes
- Reutilizar PM2 cannanext (ID 0)
- Documentar todo para contribuidores
