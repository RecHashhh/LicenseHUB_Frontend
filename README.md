# Frontend - Autodesk License Manager

Aplicacion React (Vite) para gestion de licencias Autodesk.

## Requisitos

- Node.js 20+
- npm 10+

## Variables de entorno

Crear `frontend/.env` desde `.env.example`:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

## Ejecutar en desarrollo

```powershell
cd frontend
npm install
npm run dev
```

## Build de produccion

```powershell
npm run build
npm run preview
```

## Modulos de UI

- Login con JWT
- Dashboard con indicadores
- Licencias (tabla, filtros, import/export Excel)
- Solicitudes (nueva licencia o renovacion)
- Reportes (descarga de PDF)
- Informacion de contratacion

## Estructura principal

```text
src/
  components/
    Layout.jsx
    ProtectedRoute.jsx
    StatCard.jsx
  context/
    AuthContext.jsx
  pages/
    LoginPage.jsx
    DashboardPage.jsx
    LicensesPage.jsx
    RequestsPage.jsx
    ReportsPage.jsx
    InfoPage.jsx
  routes/
    AppRoutes.jsx
  services/
    api.js
    authService.js
    licenseService.js
    requestService.js
    reportService.js
    userService.js
    softwareService.js
```
