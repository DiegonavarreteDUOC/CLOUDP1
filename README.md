# 🚀 Pedidos360 — Sistema de Gestión de Pedidos Cloud Native

![AWS](https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Java](https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

> **Evaluación Parcial — DSY1107 Desarrollo Cloud Native I | Duoc UC**  
> Arquitectura Cloud Native completa sobre Amazon Web Services con autenticación OAuth2, despliegue en EC2 y pipeline CI/CD.

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos](#-requisitos)
- [Levantar el Proyecto](#-levantar-el-proyecto)
- [Endpoints del Backend](#-endpoints-del-backend)
- [Seguridad con AWS Cognito](#-seguridad-con-aws-cognito)
- [CI/CD con GitHub Actions](#-cicd-con-github-actions)

---

## 📖 Descripción

**Pedidos360** es un sistema de gestión de pedidos desarrollado con una arquitectura **Cloud Native** sobre Amazon Web Services. Permite a los usuarios autenticarse de forma segura con **AWS Cognito**, visualizar pedidos en un **Dashboard reactivo** y crear nuevos pedidos desde la interfaz web, con fechas de despacho y entrega calculadas automáticamente.

### Funcionalidades
- 🔐 **Autenticación segura** con Amazon Cognito (OAuth2 / JWT)
- 📊 **Dashboard** con tarjetas de resumen (Total, Entregados, En Tránsito, Pendientes)
- 📦 **Tabla de pedidos** con ID, producto, fechas de despacho/entrega, total y estado
- ➕ **Crear pedidos** desde la interfaz con fechas automáticas
- 🚪 **Cerrar sesión** con limpieza del token JWT

---

## 🏗 Arquitectura

```
┌─────────────┐     JWT Token      ┌─────────────────┐
│   React +   │ ─────────────────► │   AWS Cognito   │
│    Vite     │ ◄───────────────── │   User Pool     │
│  (Frontend) │   ID Token (JWT)   └─────────────────┘
└──────┬──────┘
       │  Authorization: Bearer <JWT>
       ▼
┌──────────────────────────────────────┐
│         Amazon EC2 (Ubuntu)          │
│   ┌──────────────────────────────┐   │
│   │   Spring Boot (Java 21)      │   │
│   │   Puerto 8080                │   │
│   │   - GET  /api/pedidos        │   │
│   │   - POST /api/pedidos        │   │
│   │   - Valida JWT con Cognito   │   │
│   └──────────────────────────────┘   │
└──────────────────────────────────────┘
       ▲
       │  Docker Image
┌──────────────┐
│ GitHub       │
│ Actions      │ → Maven Build → Docker Push → SSH Deploy
│ (CI/CD)      │
└──────────────┘
```

---

## 🛠 Tecnologías

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React + Vite | 18 / 5 |
| UI | Bootstrap | 5 |
| Auth Client | amazon-cognito-identity-js | Latest |
| HTTP Client | Axios | Latest |
| Backend | Java + Spring Boot | 21 / 3.x |
| Seguridad | Spring Security OAuth2 Resource Server | 3.x |
| Base de Datos | H2 (In-Memory) | - |
| Auth Server | AWS Cognito | - |
| Servidor | Amazon EC2 (Ubuntu t3.micro) | - |
| Contenedor | Docker | Latest |
| CI/CD | GitHub Actions | - |

---

## 📁 Estructura del Proyecto

```
PedidosAWS/
├── 📁 backend/                          # API REST Spring Boot
│   ├── 📁 .github/workflows/
│   │   └── deploy.yml                   # Pipeline CI/CD
│   ├── 📁 src/main/java/com/example/demo/
│   │   ├── DemoApplication.java         # Punto de entrada
│   │   ├── 📁 config/
│   │   │   └── SecurityConfig.java      # OAuth2 + CORS
│   │   └── 📁 controller/
│   │       └── ApiController.java       # Endpoints REST
│   ├── 📁 src/main/resources/
│   │   └── application.yml              # Configuración Cognito
│   └── Dockerfile                       # Contenedor Docker
│
├── 📁 frontend/                         # SPA React + Vite
│   ├── 📁 src/
│   │   ├── App.jsx                      # Componente principal + Dashboard
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
│
└── desplegar.bat                        # Script de despliegue a EC2
```

---

## ⚙️ Requisitos

### Local
- [Node.js](https://nodejs.org/) v18+
- [Java 21](https://adoptium.net/)
- [Maven](https://maven.apache.org/) (o usar el `mvnw` incluido)
- [Git](https://git-scm.com/)

### AWS (para modo nube)
- Cuenta AWS Academy / Learner Lab activa
- AWS CLI configurado (`~/.aws/credentials`)
- Archivo `labsuser.pem` descargado desde AWS Details

---

## 🚀 Levantar el Proyecto

### Opción 1 — Solo Frontend local (más rápido)

```bash
# 1. Clonar el repositorio
git clone https://github.com/DiegonavarreteDUOC/CLOUDP1.git
cd CLOUDP1/frontend

# 2. Instalar dependencias
npm install

# 3. Iniciar
npm run dev
```

Abre el navegador en **http://localhost:5173/**

**Credenciales de prueba:**
```
Email:    admin@pedidos.com
Password: Password123!
```

---

### Opción 2 — Backend en EC2 (modo completo)

**Pre-requisitos:**
1. Iniciar el Laboratorio de AWS Academy → esperar círculo verde
2. Descargar `labsuser.pem` desde AWS Details y colocarlo en la raíz del proyecto

```bash
# Desde la carpeta raíz del proyecto
# En Windows: doble clic en desplegar.bat
# O desde PowerShell:
.\desplegar.bat
```

El script automáticamente:
1. Copia el backend a tu instancia EC2
2. Mata el proceso anterior en el puerto 8080
3. Compila el proyecto con Maven (clean package)
4. Inicia el servidor Java

Espera hasta ver en la consola:
```
Started DemoApplication in X seconds
```

Luego inicia el frontend:
```bash
cd frontend
npm run dev
```

---

### Opción 3 — Configuración AWS CLI (credenciales nuevas cada sesión)

```bash
# Editar ~/.aws/credentials con los datos del Learner Lab:
[default]
aws_access_key_id=TU_ACCESS_KEY
aws_secret_access_key=TU_SECRET_KEY
aws_session_token=TU_SESSION_TOKEN
```

---

## 📡 Endpoints del Backend

Base URL: `http://34.203.212.217:8080`

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|--------------|-------------|
| `GET` | `/api/pedidos` | 🔐 JWT requerido | Retorna lista de pedidos |
| `POST` | `/api/pedidos` | 🔐 JWT requerido | Crea un nuevo pedido |

### Ejemplo de Request

```bash
# GET pedidos (con token JWT de Cognito)
curl -H "Authorization: Bearer <JWT_TOKEN>" \
     http://34.203.212.217:8080/api/pedidos
```

### Ejemplo de Response

```json
[
  {
    "id": "PED-1001",
    "producto": "Laptop AWS Cloud",
    "total": 1200.50,
    "estado": "Entregado",
    "despacho": "2026-09-16",
    "entrega": "2026-09-20"
  },
  {
    "id": "PED-1002",
    "producto": "Teclado Mecánico",
    "total": 85.00,
    "estado": "En Tránsito",
    "despacho": "2026-09-20",
    "entrega": "2026-09-24"
  }
]
```

---

## 🔐 Seguridad con AWS Cognito

El sistema implementa **OAuth2 Resource Server** con validación automática de tokens JWT firmados por AWS Cognito.

### Flujo de Autenticación

```
1. Usuario ingresa credenciales en React
2. React llama a AWS Cognito (amazon-cognito-identity-js)
3. Cognito valida y retorna ID Token (JWT firmado)
4. React adjunta el JWT en cada request: Authorization: Bearer <token>
5. Spring Boot valida automáticamente la firma del JWT contra Cognito
6. Si es válido → 200 OK con datos | Si no → 401 Unauthorized
```

### Configuración (application.yml)

```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://cognito-idp.us-east-1.amazonaws.com/us-east-1_4Rgib1wIK
```

### Datos del User Pool

| Parámetro | Valor |
|-----------|-------|
| User Pool ID | `us-east-1_4Rgib1wIK` |
| App Client ID | `24a5q70v6ns1tsqv3trttuv63g` |
| Región | `us-east-1` (N. Virginia) |

---

## 🔄 CI/CD con GitHub Actions

El archivo `.github/workflows/deploy.yml` automatiza el despliegue completo:

```
Push a main
    ↓
Maven clean package (build JAR)
    ↓
Docker build image
    ↓
Docker push a Docker Hub
    ↓
SSH a EC2 → docker pull → docker run
```

### Secrets requeridos en GitHub

| Secret | Descripción |
|--------|------------|
| `EC2_HOST` | IP pública de la instancia EC2 |
| `EC2_SSH_KEY` | Contenido del archivo `labsuser.pem` |
| `DOCKER_USERNAME` | Usuario de Docker Hub |
| `DOCKER_PASSWORD` | Contraseña de Docker Hub |

---

## 👤 Autor

**Diego Navarrete**  
Ingeniería en Informática — Duoc UC  
GitHub: [@DiegonavarreteDUOC](https://github.com/DiegonavarreteDUOC)

---

<div align="center">
  <strong>DSY1107 — Desarrollo Cloud Native I | Duoc UC | Septiembre 2026</strong>
</div>
