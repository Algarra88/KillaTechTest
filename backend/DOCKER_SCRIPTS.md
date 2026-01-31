# Script de Gestión de Migraciones

Un único script simplificado para ejecutar cualquier comando Django en Docker.

## Script

### `manage.sh` - Ejecutar comandos Django
Ejecuta cualquier comando `manage.py` en el contenedor.

```bash
./manage.sh <comando> [args...]
```

---

## Ejemplos comunes

**Aplicar migraciones:**
```bash
./manage.sh migrate
```

**Crear migraciones:**
```bash
./manage.sh makemigrations
```

**Crear migraciones de una app específica:**
```bash
./manage.sh makemigrations Tasks
```

**Ver estado de migraciones:**
```bash
./manage.sh showmigrations
```

**Otros comandos útiles:**
```bash
./manage.sh check                # Verificar configuración
./manage.sh shell                # Abrir shell interactivo
./manage.sh showmigrations Tasks # Ver migraciones de Tasks
```

---

## Flujo de desarrollo

### 1. Cambiar un modelo
Edita `TasksApp/Tasks/models.py` con tus cambios.

### 2. Crear migración
```bash
./manage.sh makemigrations
```

### 3. Aplicar migración
```bash
./manage.sh migrate
```

### 4. Verificar (opcional)
```bash
./manage.sh showmigrations
```

---

## Nota

- El servidor se ejecuta automáticamente con `docker-compose up -d`
- Los comandos se ejecutan EN EL CONTENEDOR, no localmente
- Docker debe estar activo para usar este script


