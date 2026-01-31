# 📝 Killa - Task Management Application

Sistema completo de gestión de tareas construido con **Angular 19**, **Django 5.2** y **PostgreSQL 15**, completamente containerizado con **Docker Compose**.

## 🎯 Características

### Backend (Django REST API)
✅ API REST completa con Django REST Framework  
✅ CRUD de tareas con soft-delete  
✅ Restauración de tareas eliminadas  
✅ PostgreSQL como base de datos  
✅ CORS configurado para desarrollo  
✅ Migraciones automáticas al iniciar  
✅ Arquitectura multi-stage Docker optimizada  

### Frontend (Angular)
✅ Framework Angular 19  
✅ Interfaz reactiva con RxJS  
✅ Hot-reload en desarrollo  
✅ TypeScript 5.7  
✅ Diseño responsive  

### Infraestructura
✅ 100% Dockerizado - No requiere instalaciones locales  
✅ Docker Compose para orquestación  
✅ Volúmenes persistentes para datos  
✅ Hot-reload en backend y frontend  
✅ Network aislada entre servicios  

---

## 🏗️ Arquitectura

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend      │         │   PostgreSQL    │
│   Angular 19    │ ───────▶│   Django 5.2    │ ───────▶│      15         │
│   Port: 4200    │         │   Port: 8000    │         │   Port: 5432    │
└─────────────────┘         └─────────────────┘         └─────────────────┘
      Node 18                    Python 3.13               postgres:15
```

### Servicios

| Servicio | Tecnología | Puerto | Descripción |
|----------|------------|--------|-------------|
| **frontend** | Angular 19 + Node 18 | 4200 | Aplicación web SPA |
| **backend** | Django 5.2 + Python 3.13 | 8000 | API REST |
| **db** | PostgreSQL 15 | 5432 | Base de datos |

---

## 🚀 Inicio Rápido

### Prerrequisitos

- [Docker](https://www.docker.com/get-started) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)

**No necesitas instalar:**
- ❌ Node.js
- ❌ npm
- ❌ Python
- ❌ PostgreSQL
- ❌ Angular CLI
- ❌ Django

Todo está containerizado. ✨

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd Killa
```

2. **Levantar los servicios**
```bash
docker-compose up -d
```

Esto iniciará automáticamente:
- Base de datos PostgreSQL
- Backend Django (aplicará migraciones automáticamente)
- Frontend Angular

3. **Verificar que todo está corriendo**
```bash
docker-compose ps
```

Deberías ver 3 servicios corriendo:
- `killa-db-1`
- `killa-backend-1`
- `killa-frontend-1`

4. **Acceder a la aplicación**

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8000/api/tasks/
- **Django Admin**: http://localhost:8000/admin

---

## 📁 Estructura del Proyecto

```
Killa/
├── backend/                    # Backend Django
│   ├── TasksApp/
│   │   ├── Tasks/             # App principal
│   │   │   ├── models.py      # Modelo TaskModel con soft-delete
│   │   │   ├── views.py       # ViewSets de DRF
│   │   │   ├── serializers.py # Serializers
│   │   │   ├── urls.py        # Rutas de la API
│   │   │   ├── managers.py    # Managers personalizados
│   │   │   └── querysets.py   # QuerySets para soft-delete
│   │   └── TasksApp/          # Configuración Django
│   │       ├── settings.py    # Settings con PostgreSQL y CORS
│   │       └── urls.py        # URLs principales
│   ├── Dockerfile             # Multi-stage build optimizado
│   ├── requirements.txt       # Dependencias Python
│   ├── entrypoint.sh         # Script de inicialización
│   └── manage.sh             # Helper para manage.py
│
├── frontend/                  # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Componentes Angular
│   │   │   ├── services/     # Servicios HTTP
│   │   │   ├── models/       # Interfaces TypeScript
│   │   │   └── environments/ # Configuración de entornos
│   │   ├── index.html
│   │   └── main.ts
│   ├── Dockerfile            # Imagen Node Alpine
│   ├── package.json          # Dependencias npm
│   └── angular.json          # Configuración Angular CLI
│
└── docker-compose.yaml       # Orquestación de servicios
```

---

## 🔌 API Endpoints

Base URL: `http://localhost:8000/api`

### Tareas

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/tasks/` | Listar todas las tareas activas | - |
| POST | `/api/tasks/` | Crear nueva tarea | `{title, description, completed}` |
| GET | `/api/tasks/{id}/` | Obtener tarea específica | - |
| PUT | `/api/tasks/{id}/` | Actualizar tarea completa | `{title, description, completed}` |
| PATCH | `/api/tasks/{id}/` | Actualizar parcialmente | Campos opcionales |
| DELETE | `/api/tasks/{id}/` | Eliminar tarea (soft-delete) | - |

### Ejemplo de Request

**Crear tarea:**
```bash
curl -X POST http://localhost:8000/api/tasks/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi primera tarea",
    "description": "Descripción de la tarea",
    "completed": false
  }'
```

**Respuesta:**
```json
{
  "id": 1,
  "title": "Mi primera tarea",
  "description": "Descripción de la tarea",
  "completed": false,
  "created_at": "2024-01-31T22:30:00Z",
  "updated_at": "2024-01-31T22:30:00Z"
}
```

---

## 🛠️ Comandos Útiles

### Docker Compose

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Reiniciar un servicio
docker-compose restart backend

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ borra la BD)
docker-compose down -v

# Reconstruir imágenes
docker-compose build

# Reconstruir y reiniciar
docker-compose up -d --build
```

### Backend (Django)

```bash
# Crear migraciones
./backend/manage.sh makemigrations

# Aplicar migraciones
./backend/manage.sh migrate

# Acceder al shell de Django
./backend/manage.sh shell

# Crear superusuario
./backend/manage.sh createsuperuser

# Ver estado de migraciones
./backend/manage.sh showmigrations

# Ejecutar cualquier comando manage.py
./backend/manage.sh <comando>
```

### Frontend (Angular)

```bash
# Acceder al contenedor
docker-compose exec frontend sh

# Instalar dependencia
docker-compose exec frontend npm install <paquete>

# Ejecutar tests
docker-compose exec frontend npm test

# Build de producción
docker-compose exec frontend npm run build
```

### Base de Datos

```bash
# Acceder a PostgreSQL
docker-compose exec db psql -U postgres -d tasks_db

# Backup de la base de datos
docker-compose exec db pg_dump -U postgres tasks_db > backup.sql

# Restaurar backup
docker-compose exec -T db psql -U postgres tasks_db < backup.sql
```

---

## 🔧 Modelo de Datos

### TaskModel

```python
class TaskModel(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
```

**Características:**
- ✅ Soft-delete: Las tareas eliminadas no se borran físicamente
- ✅ Timestamps automáticos (created_at, updated_at)
- ✅ Manager personalizado para filtrar tareas activas
- ✅ Método `restore()` para recuperar tareas

---

## 🌍 Variables de Entorno

### Backend

Configuradas en `docker-compose.yaml`:

```yaml
environment:
  - DB_NAME=tasks_db
  - DB_USER=postgres
  - DB_PASS=postgres
  - DB_HOST=db
  - DB_PORT=5432
```

### Frontend

```yaml
environment:
  - CHOKIDAR_USEPOLLING=true  # Permite hot-reload en Docker
```

---

## 🔐 Configuración de CORS

El backend está configurado para aceptar requests desde:

- `http://localhost:4200` (Frontend en desarrollo)
- `http://127.0.0.1:4200`
- `http://0.0.0.0:4200`

Modificar en `backend/TasksApp/TasksApp/settings.py` si es necesario.

---

## 📦 Dependencias

### Backend (Python 3.13)

```txt
Django==5.2.10
django-cors-headers==4.9.0
djangorestframework==3.16.1
psycopg[binary]
```

### Frontend (Node 18)

```json
{
  "dependencies": {
    "@angular/common": "^19.2.0",
    "@angular/core": "^19.2.0",
    "@angular/forms": "^19.2.0",
    "rxjs": "~7.8.0",
    "zone.js": "~0.15.0"
  }
}
```

---

## 🚨 Troubleshooting

### El backend no arranca

**Problema:** Error de conexión a la base de datos

```bash
# Verificar que el servicio db está corriendo
docker-compose ps

# Ver logs
docker-compose logs db

# Reiniciar servicios
docker-compose restart db backend
```

### El frontend no recarga automáticamente

**Problema:** Los cambios no se reflejan

```bash
# Verificar que CHOKIDAR_USEPOLLING está en true
docker-compose config

# Reiniciar el frontend
docker-compose restart frontend
```

### Puerto ya en uso

**Problema:** `Error: bind: address already in use`

```bash
# Linux/Mac: Encontrar proceso usando el puerto
lsof -i :4200
lsof -i :8000

# Windows: Encontrar proceso
netstat -ano | findstr :4200

# Matar el proceso o cambiar el puerto en docker-compose.yaml
```

### Migraciones no se aplican

```bash
# Entrar al contenedor
docker-compose exec backend bash

# Aplicar migraciones manualmente
python manage.py migrate

# Ver estado
python manage.py showmigrations
```

### Error de permisos en scripts

```bash
# Dar permisos de ejecución
chmod +x backend/*.sh
```

---

## 🔄 Flujo de Desarrollo

### Desarrollo de Backend

1. Modificar código en `backend/TasksApp/`
2. Los cambios se sincronizan automáticamente (volumen montado)
3. Django recarga automáticamente
4. Si modificaste modelos:
   ```bash
   ./backend/manage.sh makemigrations
   ./backend/manage.sh migrate
   ```

### Desarrollo de Frontend

1. Modificar código en `frontend/src/`
2. Los cambios se detectan automáticamente
3. Angular recarga en el navegador (hot-reload)
4. Si instalaste paquetes:
   ```bash
   docker-compose restart frontend
   ```

---

## 🧪 Testing

### Backend

```bash
# Ejecutar tests de Django
docker-compose exec backend python manage.py test

# Con cobertura
docker-compose exec backend coverage run manage.py test
docker-compose exec backend coverage report
```

### Frontend

```bash
# Tests unitarios con Karma
docker-compose exec frontend npm test

# Tests e2e (si están configurados)
docker-compose exec frontend npm run e2e
```

---

## 📊 Monitoreo y Logs

### Ver logs en tiempo real

```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend

# Últimas 100 líneas
docker-compose logs --tail=100 backend
```

### Estado de los contenedores

```bash
# Ver servicios corriendo
docker-compose ps

# Estadísticas de uso
docker stats

# Inspeccionar un servicio
docker-compose inspect backend
```

---

## 🚀 Despliegue a Producción

### Build de Producción

```bash
# Frontend
docker-compose exec frontend npm run build

# Los archivos estarán en frontend/dist/
```

### Consideraciones

1. **Seguridad:**
   - Cambiar `SECRET_KEY` de Django
   - Deshabilitar `DEBUG = False`
   - Configurar `ALLOWED_HOSTS`
   - Usar variables de entorno seguras

2. **Base de Datos:**
   - Usar PostgreSQL managed (AWS RDS, Google Cloud SQL)
   - Configurar backups automáticos
   - SSL para conexiones

3. **Frontend:**
   - Servir archivos estáticos desde CDN
   - Habilitar compresión gzip
   - Configurar caché HTTP

4. **Backend:**
   - Usar Gunicorn o uWSGI
   - Configurar Nginx como reverse proxy
   - Rate limiting
   - Logging centralizado

---

## 📝 Características del Soft-Delete

Este proyecto implementa soft-delete en el modelo de tareas:

- ✅ `DELETE` marca la tarea como eliminada (campo `deleted_at`)
- ✅ Las tareas eliminadas no aparecen en listados normales
- ✅ Se pueden recuperar con el método `restore()`
- ✅ Manager personalizado filtra automáticamente tareas activas
- ✅ `all_objects` manager accede a todas las tareas (incluidas eliminadas)

**Uso:**

```python
# Eliminar (soft)
task = TaskModel.objects.get(id=1)
task.delete()  # Solo marca deleted_at

# Eliminar permanentemente
task.hard_delete()

# Restaurar
task.restore()

# Ver todas (incluidas eliminadas)
all_tasks = TaskModel.all_objects.all()
```

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

## 👥 Autores

- **Luis Adolfo Algarra Vasquez** - *Trabajo inicial*

---

## 🙏 Agradecimientos

- Django REST Framework por la excelente API
- Angular team por el framework moderno
- Docker por simplificar el desarrollo

---

## 📞 Soporte

¿Encontraste un bug? ¿Tienes una sugerencia?

- Abre un [Issue](https://github.com/algarra88/KillaTechTest/issues)
- Consulta la [Documentación de Django](https://docs.djangoproject.com/)
- Revisa la [Documentación de Angular](https://angular.io/docs)

---

**⭐ Si este proyecto te fue útil, considera darle una estrella ⭐**