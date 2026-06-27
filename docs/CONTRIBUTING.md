# Guía de Contribución - red.cheosys.com

## Bienvenido

Este es un proyecto open source para ayudar a organizar la recolección de datos en situaciones de emergencia o necesidad comunitaria. Tu contribución es valiosa.

## Código de Conducta

- Sé respetuoso con todos los participantes
- Enfócate en lo que es mejor para la comunidad
- Acepta críticas constructivas
- Prioriza la accesibilidad y usabilidad

## Cómo Contribuir

### 1. Fork el Repositorio
```bash
# En GitHub, haz clic en "Fork"
git clone https://github.com/TU-USUARIO/red-cheosys.git
cd red-cheosys
```

### 2. Crea una Rama
```bash
git checkout -b feature/nombre-descriptivo
# Ejemplo: git checkout -b feature/mejorar-formulario
```

### 3. Haz tus Cambios
- Sigue el estilo de código existente
- Añade comentarios claros
- Actualiza la documentación si es necesario

### 4. Prueba tus Cambios
```bash
npm run dev
# Verifica que todo funcione
npm run build
```

### 5. Commit tus Cambios
```bash
git add .
git commit -m "Descripción clara del cambio"
```

### 6. Push a tu Fork
```bash
git push origin feature/nombre-descriptivo
```

### 7. Crea un Pull Request
- Ve a tu fork en GitHub
- Haz clic en "Pull Request"
- Describe claramente tus cambios
- Referencia issues si aplica

## Áreas de Contribución

### Buenas Primeras Issues
Busca issues etiquetados con:
- `good first issue` - Para principiantes
- `help wanted` - Se necesita ayuda
- `documentation` - Mejoras de documentación

### Tipos de Contribuciones
- **Código:** Nuevas funcionalidades, bug fixes
- **Diseño:** Mejoras de UI/UX, accesibilidad
- **Documentación:** Clarificar, traducir, corregir
- **Testing:** Reportar bugs, escribir tests
- **Ideas:** Sugerencias, discusiones en issues

## Estilo de Código

### JavaScript/TypeScript
- Usar TypeScript para todo código nuevo
- Seguir ESLint config del proyecto
- Nombres descriptivos en inglés
- Comentarios en español para documentación

### Commits
```
tipo: descripción corta

Cuerpo opcional con más detalles.

- tipo: feat, fix, docs, style, refactor, test, chore
- descripción: imperativo, minúscula, sin punto final
```

### Ramas
- `main` - Producción estable
- `develop` - Desarrollo activo
- `feature/*` - Nuevas funcionalidades
- `fix/*` - Corrección de bugs
- `docs/*` - Solo documentación

## Proceso de Review

1. Un mantenedor revisará tu PR
2. Se pueden pedir cambios o aclaraciones
3. Una vez aprobado, se mergea a `develop`
4. Periódicamente se mergea `develop` a `main`

## Preguntas

- Abre un issue con la etiqueta `question`
- Sé específico y proporciona contexto
- Incluye ejemplos si es posible

## Licencia

Al contribuir, aceptas que tus contribuciones se licencien bajo la licencia del proyecto (MIT).

## Reconocimiento

Todos los contribuidores son reconocidos en el README.md principal.

¡Gracias por ayudar a hacer una diferencia!
