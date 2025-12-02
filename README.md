# GarageConnect Frontend

Sistema de gestión integral para talleres mecánicos. Permite la administración de usuarios, gestión de órdenes de trabajo, agendamiento de citas y seguimiento de vehículos.

## Tecnologías

Este proyecto está construido con:

- **Vue 3** (Composition API)
- **Vite** (Build tool)
- **TypeScript** (Tipado estático)
- **Pinia** (Gestión de estado)
- **Vuetify 3** & **TailwindCSS** (Estilos y componentes UI)
- **Socket.io Client** (Notificaciones en tiempo real)

## Instalación y Configuración

1.  **Clonar el repositorio**
    ```bash
    git clone <url-del-repo>
    cd garage-frontend
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno**
    Crea un archivo `.env` en la raíz del proyecto (puedes basarte en `.env.example` si existe) y define la URL del backend:
    ```env
    VITE_API_URL=http://localhost:3000
    ```

4.  **Ejecutar en desarrollo**
    ```bash
    npm run dev
    ```

## Estructura del Proyecto

- `src/views`: Vistas principales (Admin, Cliente, Mecánico, Auth).
- `src/components`: Componentes reutilizables y específicos por rol.
- `src/stores`: Stores de Pinia (Auth, Notificaciones, etc.).
- `src/services`: Servicios de API y Sockets.
- `src/types`: Definiciones de tipos TypeScript.

## Funcionalidades Principales

### Roles de Usuario

1.  **Administrador**
    - Gestión completa de usuarios (Crear, Editar, Eliminar).
    - Asignación de roles (Cliente, Mecánico, Admin).
    - Panel de control con estadísticas (próximamente).

2.  **Mecánico**
    - Visualización de agenda de citas.
    - Gestión de órdenes de trabajo (Crear, Actualizar estado, Agregar ítems).
    - Notificaciones de nuevas asignaciones.

3.  **Cliente**
    - Agendamiento de citas en línea.
    - Visualización del estado de su vehículo.
    - Historial de órdenes de trabajo.
    - Perfil de usuario y gestión de vehículos.

### Notificaciones

El sistema cuenta con un módulo de notificaciones en tiempo real para mantener informados a todos los usuarios sobre cambios importantes (citas confirmadas, vehículos listos, etc.).

## Paleta de Colores

- **Oscuro:** `#17252A`
- **Intermedio Oscuro:** `#2B7A78`
- **Base:** `#3AAFA9`
- **Intermedio Claro:** `#DEF2F1`
- **Claro:** `#FEFFFF`
- **Acento:** `#DC2626` (Rojo Garage)

---
Desarrollado para GarageConnect.
