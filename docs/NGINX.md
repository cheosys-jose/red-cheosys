# Configuración Nginx - red.cheosys.com

## Archivo de Configuración

**Ubicación:** `/etc/nginx/sites-available/red.cheosys.com`

```nginx
server {
    server_name red.cheosys.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/red.cheosys.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/red.cheosys.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = red.cheosys.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    server_name red.cheosys.com;
    return 404; # managed by Certbot
}
```

## Pasos para Configurar

### 1. Crear archivo
```bash
sudo nano /etc/nginx/sites-available/red.cheosys.com
```

### 2. Pegar la configuración de arriba

### 3. Crear symlink
```bash
sudo ln -s /etc/nginx/sites-available/red.cheosys.com /etc/nginx/sites-enabled/
```

### 4. Verificar sintaxis
```bash
sudo nginx -t
```

### 5. Recargar nginx
```bash
sudo systemctl reload nginx
```

### 6. Obtener SSL con Certbot
```bash
sudo certbot --nginx -d red.cheosys.com
```

## Notas Importantes

- **NO modificar** otros archivos en sites-enabled/
- Certbot manejará automáticamente la configuración SSL
- El puerto 3001 debe estar libre antes de iniciar
- Después de obtener SSL, Certbot modificará automáticamente el archivo

## Verificación

```bash
# Ver sitios habilitados
ls -la /etc/nginx/sites-enabled/

# Ver configuración
cat /etc/nginx/sites-enabled/red.cheosys.com

# Probar desde fuera
curl -I https://red.cheosys.com
```
