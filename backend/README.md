# TasksApp - Backend en Docker

API REST para gestión de tareas con Django, PostgreSQL y Docker.

## 🚀 Inicio rápido

### 1. Iniciar los contenedores
```bash
docker-compose up -d
```

El servidor estará disponible en `http://localhost:8000`

### 2. Crear migraciones (si agregaste modelos)
```bash
./manage.sh makemigrations
```

### 3. Aplicar migraciones
```bash
./manage.sh migrate
```

---

## 📝 Script disponible

Solo un script necesario:

| Script | Comando | Descripción |
|--------|---------|-------------|
| `manage.sh` | `./manage.sh makemigrations` | Crear nuevas migraciones |
| `manage.sh` | `./manage.sh makemigrations Tasks` | Crear migraciones de app específica |
| `manage.sh` | `./manage.sh migrate` | Aplicar migraciones a BD |
| `manage.sh` | `./manage.sh <comando>` | Cualquier comando manage.py |

---

## 🔄 Flujo típico de desarrollo

```bash
# 1. Iniciar Docker
docker-compose up -d

# 2. Editar models.py (en tu editor)

# 3. Crear migración
./manage.sh makemigrations

# 4. Aplicar migración
./manage.sh migrate

# 5. Verificar cambios en http://localhost:8000
```

---

## 📋 Estructura del proyecto

```
backend/
├── TasksApp/
│   ├── Tasks/              # App principal
│   │   ├── models.py       # Modelos con soft-delete
│   │   ├── serializers.py  # Validación de datos
│   │   ├── views.py        # Lógica de endpoints
│   │   ├── urls.py         # Rutas
│   │   ├── managers.py     # QuerySet personalizado
│   │   ├── querysets.py    # Soft-delete logic
│   │   └── migrations/     # Historial de cambios BD
│   └── TasksApp/           # Configuración Django
├── docker-compose.yml      # Configuración Docker
├── Dockerfile              # Imagen del contenedor
├── requirements.txt        # Dependencias Python
├── manage.sh              # Script para ejecutar manage.py
└── entrypoint.sh          # Script de inicio del contenedor
```

---

## 🐛 Debugging

**Ver logs en tiempo real:**
```bash
docker-compose logs -f backend
```

**Acceder al shell del contenedor:**
```bash
docker-compose exec backend bash
```

**Ver estado de migraciones:**
```bash
./manage.sh showmigrations
```

**Abrir shell de Django:**
```bash
./manage.sh shell
```

---

## 🛑 Detener los contenedores

```bash
docker-compose down
```

---

## 📚 Documentación adicional

- [DOCKER_SCRIPTS.md](./DOCKER_SCRIPTS.md) - Guía del script manage.sh
- [Django Admin](http://localhost:8000/admin) - Panel administrativo
- [API](http://localhost:8000/api) - Endpoints REST

---

## ✅ Features

✅ CRUD de tareas  
✅ Soft-delete (registros no se borran completamente)  
✅ Restauración de tareas eliminadas  
✅ Endpoint para listar tareas eliminadas  
✅ PostgreSQL como base de datos  
✅ Docker para desarrollo sin instalar dependencias locales  

---

## 🔌 Endpoints principales

```
GET    /api/tasks/           - Listar tareas
POST   /api/tasks/           - Crear tarea
GET    /api/tasks/{id}/      - Obtener tarea
PUT    /api/tasks/{id}/      - Actualizar tarea
DELETE /api/tasks/{id}/      - Eliminar tarea (soft-delete)
GET    /api/tasks/deleted/   - Listar tareas eliminadas
POST   /api/tasks/{id}/restore/ - Restaurar tarea
```

---

## 🚨 Troubleshooting

**"docker-compose: command not found"**
```bash
# macOS
brew install docker-compose
```

**"Permission denied" en scripts**
```bash
chmod +x *.sh
```

**Los scripts no funcionan**
- Verifica que Docker está corriendo
- Verifica que hay un `docker-compose.yml` en esta carpeta
- Verifica que el servicio se llama `backend` en docker-compose.yml

---

## 📞 Notas

- El script ejecuta comandos EN EL CONTENEDOR, no localmente
- No necesitas Python instalado en tu máquina
- Los datos persisten en volúmenes Docker
- El servidor se inicia automáticamente con `docker-compose up -d`

