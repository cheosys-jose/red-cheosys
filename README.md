# red.cheosys.com - Centro de Acopio de Datos

Sistema minimalista para recolección de datos en situaciones de emergencia o necesidad comunitaria.

## 🎯 Objetivo

Facilitar la organización de ayuda comunitaria mediante la recolección estructurada de datos, permitiendo que personas en necesidad puedan comunicar sus requerimientos de forma simple y directa.

## 🚀 Características

- **Minimalista**: Interfaz limpia y directa, sin distracciones
- **Responsive**: Funciona en cualquier dispositivo
- **Open Source**: Código abierto para que cualquiera pueda contribuir
- **Modular**: Arquitectura flexible y extensible
- **Documentado**: Guías completas para desarrolladores

## 📋 Tipos de Ayuda

- Alimento
- Medicina
- Agua
- Ropa
- Transporte
- Alojamiento
- Otro

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Almacenamiento**: JSON por día (simple, portable)
- **Servidor**: Nginx + PM2
- **SSL**: Certbot (Let's Encrypt)

## 📖 Documentación

- [Ambiente del Servidor](docs/AMBIENTE-SERVIDOR.md) - Configuración del servidor
- [Instalación](docs/INSTALACION.md) - Guía paso a paso
- [Configuración Nginx](docs/NGINX.md) - Reverse proxy
- [Estructura de Datos](docs/ESTRUCTURA-DATOS.md) - Schema JSON
- [Contribuir](docs/CONTRIBUTING.md) - Cómo participar

## 🚀 Instalación Rápida

```bash
# Clonar repositorio
git clone https://github.com/cheosys-jose/red-cheosys.git
cd red-cheosys

# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## 📦 Estructura del Proyecto

```
red-cheosys/
├── docs/              # Documentación completa
├── data/              # JSON de entradas (no commitear)
├── src/
│   ├── app/          # Next.js App Router
│   ├── components/   # Componentes React
│   └── lib/          # Utilidades
├── public/           # Assets estáticos
├── ecosystem.config.js  # PM2 config
└── package.json
```

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Lee nuestra [guía de contribución](docs/CONTRIBUTING.md).

### Pasos rápidos:
1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nombre`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nombre`
5. Pull Request

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles.

## 👥 Autor

- **CheoSYS Technologies** - [cheosys.com](https://cheosys.com)

## 🙏 Agradecimientos

A todos los desarrolladores y voluntarios que contribuyen a hacer de este proyecto una herramienta útil para la comunidad.

---

**"A un pueblo unido nadie lo detiene"**
