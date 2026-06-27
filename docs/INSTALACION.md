# Guía de Instalación - red.cheosys.com

## Requisitos Previos
- Ubuntu 22.04 LTS
- Node.js 18+
- Nginx
- PM2
- Certbot
- Acceso sudo

## Estructura del Proyecto
```
/opt/cheosys/services/web/red-cheosys/
├── docs/                    # Documentación
├── data/                    # JSON de entradas (no commitear)
├── src/                     # Código fuente
│   ├── pages/              # Páginas Next.js
│   ├── components/         # Componentes React
│   ├── styles/            # Estilos Tailwind
│   └── lib/               # Utilidades
├── public/                 # Assets estáticos
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── ecosystem.config.js     # PM2 config
```

## Pasos de Instalación

### 1. Clonar Repositorio
```bash
cd /opt/cheosys/services/web/
git clone https://github.com/cheosys-jose/red-cheosys.git
cd red-cheosys
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
```bash
cp .env.example .env.local
nano .env.local
# Editar según necesite
```

### 4. Construir Aplicación
```bash
npm run build
```

### 5. Iniciar con PM2
```bash
pm2 start ecosystem.config.js
pm2 save
```

### 6. Configurar Nginx
```bash
sudo nano /etc/nginx/sites-available/red.cheosys.com
# Pegar configuración (ver NGINX.md)
sudo ln -s /etc/nginx/sites-available/red.cheosys.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. Obtener Certificado SSL
```bash
sudo certbot --nginx -d red.cheosys.com
```

### 8. Verificar
```bash
curl -I https://red.cheosys.com
pm2 status
```

## Comandos Útiles

### Ver logs
```bash
pm2 logs red-cheosys
tail -f /var/log/nginx/red.cheosys.error.log
```

### Reiniciar
```bash
pm2 restart red-cheosys
sudo systemctl reload nginx
```

### Actualizar código
```bash
git pull origin main
npm install
npm run build
pm2 restart red-cheosys
```

## Troubleshooting

### Puerto 3001 ocupado
```bash
sudo lsof -i :3001
# Matar proceso si es necesario
```

### Nginx no recarga
```bash
sudo nginx -t
# Corregir errores de sintaxis
```

### PM2 no inicia
```bash
pm2 delete red-cheosys
pm2 start ecosystem.config.js
```
