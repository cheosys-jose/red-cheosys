# Lecciones Aprendidas - Setup Inicial

**Fecha:** 2026-06-27
**Autor:** Equipo CheoSys

## 1. Compatibilidad de Versiones

### Node.js 18.x (Servidor Actual)
- ❌ Next.js 16+ requiere Node 20.9+
- ✅ **Solución:** Usar Next.js 14.2.29
- ❌ Tailwind CSS 4 requiere Node 20+
- ✅ **Solución:** Usar Tailwind 3.4.17
- ❌ `next/font` no incluye Geist en Next 14
- ✅ **Solución:** Usar Inter de Google Fonts

### Comandos de Instalación Correctos
```bash
npm install next@14.2.29 react@18.3.1 react-dom@18.3.1
npm install -D tailwindcss@3.4.17 postcss@8.4.49 autoprefixer@10.4.20
```

## 2. Cloudflare + Nginx + SSL

### Problema Común
Cuando Cloudflare tiene un wildcard `*.cheosys.com` y el servidor recibe tráfico HTTPS, **Nginx necesita certificado SSL válido** para el subdominio específico.

### Síntoma
- HTTP funciona (puerto 80)
- HTTPS redirige a otro sitio (default de Nginx)
- Cloudflare muestra contenido incorrecto

### Solución
```bash
# Obtener certificado SSL
sudo certbot --nginx -d red.cheosys.com

# Certbot automáticamente:
# 1. Crea certificado en /etc/letsencrypt/live/
# 2. Modifica /etc/nginx/sites-available/red.cheosys.com
# 3. Agrega bloque listen 443 ssl
# 4. Agrega redirect HTTP → HTTPS
```

### Configuración Final de Nginx
```nginx
server {
    server_name red.cheosys.com;
    
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/red.cheosys.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/red.cheosys.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = red.cheosys.com) {
        return 301 https://$host$request_uri;
    }
    listen 80;
    server_name red.cheosys.com;
    return 404;
}
```

## 3. Next.js Config

### Archivo next.config.mjs (NO .ts)
Next.js 14 no soporta `next.config.ts`. Usar `.mjs`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
}

export default nextConfig
```

### Puerto Personalizado
En `package.json`:
```json
"scripts": {
  "start": "next start -p 3001"
}
```

## 4. SSH para GitHub en Servidor

GitHub ya no acepta contraseñas. Usar SSH:

```bash
# Generar clave
ssh-keygen -t ed25519 -C "email@dominio.com"
# Dejar passphrase vacío para automatización

# Agregar clave pública a GitHub:
# https://github.com/settings/ssh/new

# Probar
ssh -T git@github.com

# Cambiar remote
git remote set-url origin git@github.com:usuario/repo.git
```

## 5. Diagnóstico Rápido

### Verificar qué sirve un dominio
```bash
# Local directo
curl -I http://localhost:3001

# Via dominio
curl -I https://dominio.com

# Ver X-Powered-By
curl -I https://dominio.com | grep -i "x-powered-by"
# Next.js = correcto
# Express = problema de routing
```

### Ver certificados SSL
```bash
sudo ls -la /etc/letsencrypt/live/
```

### Ver configs Nginx activas
```bash
ls -la /etc/nginx/sites-enabled/
sudo grep -r "server_name" /etc/nginx/sites-enabled/
```

## 6. Comandos Útiles del Servidor

### PM2
```bash
pm2 list                    # Ver procesos
pm2 logs red-cheosys        # Ver logs
pm2 restart red-cheosys     # Reiniciar
pm2 save                    # Guardar estado
```

### Nginx
```bash
sudo nginx -t               # Test config
sudo systemctl reload nginx # Recargar
sudo tail -f /var/log/nginx/error.log
```

### Certbot
```bash
sudo certbot certificates   # Ver certificados
sudo certbot --nginx -d subdominio.dominio.com
```

## 7. Estructura de Datos

### Formato JSON por Día
- Archivo: `data/YYYY-MM-DD.json`
- Array de entradas
- Cada entrada tiene: id, timestamp, nombre, ubicacion, tipo, descripcion, contacto, ip_hash
- IP se guarda como hash SHA256 (privacidad)

### Backup
```bash
# Los datos NO se commitean a Git (están en .gitignore)
# Backup manual:
tar -czf backup-$(date +%Y%m%d).tar.gz data/
```

---

**Próxima Iteración:**
- [ ] Actualizar a Node.js 20+ cuando sea posible
- [ ] Agregar rate limiting a la API
- [ ] Dashboard para administradores
- [ ] Exportación de datos a CSV
- [ ] Tests automatizados
