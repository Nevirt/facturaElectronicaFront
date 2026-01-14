# Frontend - e-Kuatia Manager

Interfaz web para la gestión de facturación electrónica de Paraguay (SET e-Kuatia).

## 🚀 Tecnologías

- **Next.js 15** - Framework React con App Router
- **React 19** - Biblioteca de interfaz de usuario
- **Material-UI (MUI)** - Componentes de interfaz
- **TypeScript** - Tipado estático
- **Axios** - Cliente HTTP
- **React Hook Form** - Gestión de formularios
- **Recharts** - Gráficos y visualizaciones
- **date-fns** - Manejo de fechas

## 📋 Requisitos Previos

- Node.js 18+ o superior
- npm o yarn
- API Backend funcionando (FacturaElectronica)

## 🔧 Instalación

```bash
# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
copy .env.example .env.local

# Editar .env.local y configurar la URL de la API
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🏃‍♂️ Ejecución

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

### Modo Producción

```bash
# Construir para producción
npm run build

# Iniciar servidor de producción
npm start
```

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/                      # Páginas (App Router)
│   │   ├── dashboard/            # Dashboard principal
│   │   ├── empresas/             # Gestión de empresas
│   │   ├── clientes/             # Gestión de clientes
│   │   ├── facturas/             # Gestión de facturas
│   │   │   ├── nueva/            # Crear factura
│   │   │   └── [id]/             # Ver detalle (futuro)
│   │   ├── reportes/             # Reportes y estadísticas
│   │   ├── configuracion/        # Configuración
│   │   ├── layout.tsx            # Layout raíz
│   │   └── page.tsx              # Página principal
│   ├── components/               # Componentes reutilizables
│   │   ├── Layout.tsx            # Layout con navegación
│   │   ├── FacturaForm.tsx       # Formulario de facturas
│   │   └── StatsCard.tsx         # Tarjeta de estadísticas
│   ├── lib/                      # Utilidades y configuración
│   │   └── api.ts                # Cliente API y tipos
│   └── theme/                    # Tema de Material-UI
│       └── theme.ts
├── public/                       # Archivos estáticos
├── .env.example                  # Variables de entorno de ejemplo
├── package.json
├── tsconfig.json
└── README.md
```

## 🎨 Características

### ✅ Implementadas

- **Dashboard**: Resumen de facturación con estadísticas
- **Gestión de Empresas**: CRUD completo de empresas emisoras
- **Gestión de Clientes**: CRUD completo de clientes
- **Gestión de Facturas**:
  - Crear facturas con múltiples líneas de detalle
  - Listar facturas con filtros
  - Enviar facturas a SET
  - Consultar estado de facturas
  - Anular facturas
- **Reportes**: Estadísticas y gráficos de facturación
- **Configuración**: Información del sistema

### 🔄 Componentes Principales

#### Layout
Navegación lateral con menú principal y barra superior.

#### FacturaForm
Formulario completo para crear facturas con:
- Datos del cliente
- Datos de la factura
- Múltiples líneas de detalle
- Cálculo automático de totales, IVA y descuentos

#### StatsCard
Tarjetas de estadísticas con iconos y colores personalizables.

## 🔌 Integración con Backend

El frontend se comunica con la API REST del backend a través de Axios.

### Endpoints Utilizados

```typescript
// Facturas
POST   /api/facturas              // Crear factura
GET    /api/facturas/{id}         // Obtener factura
GET    /api/facturas              // Listar facturas
POST   /api/facturas/{id}/enviar  // Enviar a SET
POST   /api/facturas/{id}/anular  // Anular factura
GET    /api/facturas/{id}/estado  // Consultar estado

// Empresas (requiere implementación en backend)
GET    /api/empresas              // Listar empresas
GET    /api/empresas/{id}         // Obtener empresa
POST   /api/empresas              // Crear empresa
PUT    /api/empresas/{id}         // Actualizar empresa
DELETE /api/empresas/{id}         // Eliminar empresa

// Clientes (requiere implementación en backend)
GET    /api/clientes              // Listar clientes
GET    /api/clientes/{id}         // Obtener cliente
POST   /api/clientes              // Crear cliente
PUT    /api/clientes/{id}         // Actualizar cliente
DELETE /api/clientes/{id}         // Eliminar cliente
```

## 🎯 Próximos Pasos

### Backend (Requerido)

1. **Crear Controllers para Empresas y Clientes**
   - `EmpresasController.cs`
   - `ClientesController.cs`

2. **Implementar Servicios**
   - `IEmpresaService` y `EmpresaService`
   - `IClienteService` y `ClienteService`

3. **Agregar DTOs**
   - `EmpresaDTO.cs`
   - `ClienteDTO.cs`

### Frontend (Mejoras)

- [ ] Página de detalle de factura
- [ ] Descarga de XML y PDF
- [ ] Visualización de código QR
- [ ] Filtros avanzados en listados
- [ ] Paginación de tablas
- [ ] Exportación de reportes (Excel, PDF)
- [ ] Modo oscuro
- [ ] Notificaciones en tiempo real
- [ ] Autenticación y autorización
- [ ] Multi-idioma (ES/EN)

## 🐛 Solución de Problemas

### Error de Conexión con API

Si la aplicación no puede conectarse al backend:

1. Verificar que el backend esté corriendo en `http://localhost:5000`
2. Revisar la variable `NEXT_PUBLIC_API_URL` en `.env.local`
3. Verificar CORS en el backend (debe permitir `http://localhost:3000`)

### Error "Module not found"

```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Errores de TypeScript

```bash
# Verificar tipos
npm run build
```

## 📱 Responsive Design

La interfaz está completamente optimizada para:
- 📱 Móviles (< 600px)
- 📱 Tablets (600px - 960px)
- 💻 Desktop (> 960px)

## 🔒 Seguridad

- Las variables de entorno sensibles deben configurarse en el backend
- El frontend no maneja certificados ni credenciales SET
- Todas las comunicaciones con SET se realizan a través del backend
- Autenticación y autorización pendientes de implementación

## 📄 Licencia

Este proyecto es propiedad privada. Todos los derechos reservados.

## 📞 Soporte

Para soporte técnico, contactar al equipo de desarrollo.

---

**Desarrollado para la gestión de facturación electrónica según normativa SET Paraguay (e-Kuatia v150)**
