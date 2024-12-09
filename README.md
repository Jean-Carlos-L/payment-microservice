```markdown
# Payments Microservice

Este es un microservicio de pagos desarrollado en **Node.js** con **Express** y utiliza **SQLite** como base de datos para almacenar la información de los pagos. Es parte de una arquitectura de microservicios diseñada para integrarse con servicios relacionados como pedidos, inventario, clientes y compras.

---

## **Descripción del Proyecto**

El microservicio permite:

- Procesar pagos, almacenarlos y actualizar su estado.
- Gestionar reembolsos de transacciones.
- Consultar información sobre pagos realizados.
- Proveer integración con otros microservicios a través de HTTP.
- **Autenticación y autorización** para acceder a las rutas protegidas.

Cuenta con una arquitectura modular que facilita su mantenimiento, escalabilidad y pruebas.

---

## **Modelo de Base de Datos**

### **Tabla `Payments`**

| Campo            | Tipo   | Descripción                                           |
| ---------------- | ------ | ----------------------------------------------------- |
| `id`             | UUID   | Identificador único del pago.                         |
| `amount`         | FLOAT  | Monto del pago.                                       |
| `currency`       | STRING | Moneda utilizada (por ejemplo, USD, EUR).             |
| `status`         | STRING | Estado del pago (`pending`, `completed`, `refunded`). |
| `payment_method` | STRING | Método de pago (`card`, `paypal`, etc.).              |
| `customer_id`    | STRING | Identificador del cliente asociado.                   |
| `order_id`       | STRING | Identificador del pedido asociado.                    |

### **Tabla `Users`**

| Campo       | Tipo   | Descripción                              |
| ----------- | ------ | ---------------------------------------- |
| `id`        | UUID   | Identificador único del usuario.        |
| `username`  | STRING | Nombre de usuario para la autenticación. |
| `password`  | STRING | Contraseña cifrada del usuario.         |
| `createdAt` | DATE   | Fecha de creación del usuario.          |

---

## **Requisitos Previos**

- Node.js v16+ instalado.
- NPM v8+ instalado.

---

## **Instalación**

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu_usuario/payments-microservice.git
   cd payments-microservice
   ```
2. **Instalar las dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crear un archivo `.env` en el directorio raíz con el siguiente contenido:
   ```bash
   NODE_ENV=development
   PORT=3000
   DATABASE_STORAGE=./payments.db
   JWT_SECRET=your_jwt_secret_key
   ```

---

## **Ejecución del Proyecto**

1. **Iniciar el servidor en modo desarrollo:**
   ```bash
   npm run dev
   ```

2. **Iniciar el servidor en producción:**
   ```bash
   npm start
   ```

3. **El servidor estará disponible en:**
   ```bash
   http://localhost:3000
   ```

---

### **Tabla de Rutas principales**

| Método HTTP | Endpoint               | Descripción                                   | Parámetros                                                                                                                                                                                                                   |
|-------------|------------------------|-----------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `POST`      | `/auth/register`        | Registrar un nuevo usuario.                   | **Body:**<br> - `username` (string): Nombre de usuario.<br> - `password` (string): Contraseña del usuario.                                                                                                                   |
| `POST`      | `/auth/login`           | Iniciar sesión y obtener un token JWT.        | **Body:**<br> - `username` (string): Nombre de usuario.<br> - `password` (string): Contraseña del usuario.                                                                                                                   |
| `POST`      | `/payments`             | Crear un nuevo pago.                          | **Body:**<br> - `amount` (float): Monto del pago.<br> - `currency` (string): Moneda utilizada (por ejemplo, USD).<br> - `payment_method` (string): Método de pago.<br> - `customer_id` (string): ID del cliente asociado.<br> - `order_id` (string): ID del pedido. |
| `GET`       | `/payments/:id`         | Consultar un pago por su ID.                  | **Path Param:**<br> - `id` (UUID): Identificador único del pago.                                                                                                                                                           |
| `POST`      | `/payments/:id/refund`  | Reembolsar un pago existente.                 | **Path Param:**<br> - `id` (UUID): Identificador único del pago.<br> **Body:**<br> - `reason` (string, opcional): Motivo del reembolso.                                                                                     |
| `GET`       | `/payments`             | Listar todos los pagos (con filtros opcionales). | **Query Params:**<br> - `status` (string, opcional): Filtrar por estado del pago (`pending`, `completed`, `refunded`).<br> - `customer_id` (string, opcional): Filtrar por cliente asociado.                                |
| `PUT`       | `/payments/:id/status`  | Actualizar el estado de un pago existente.    | **Path Param:**<br> - `id` (UUID): Identificador único del pago.<br> **Body:**<br> - `status` (string): Nuevo estado del pago. Los valores permitidos son `pending`, `completed`, y `refunded`.                                |

---

## **Autenticación y Autorización**

### **Registro de Usuario**

La ruta `/auth/register` permite registrar un nuevo usuario proporcionando un `username` y `password`. El sistema almacenará la contraseña de manera segura (con hashing).

**Ejemplo de solicitud:**
```json
{
  "username": "user123",
  "password": "password123"
}
```

**Ejemplo de respuesta exitosa:**
```json
{
  "message": "User registered successfully"
}
```

### **Login de Usuario**

La ruta `/auth/login` permite a un usuario iniciar sesión con su nombre de usuario y contraseña. Si las credenciales son correctas, se generará un token JWT que debe ser usado para autenticarse en las rutas protegidas.

**Ejemplo de solicitud:**
```json
{
  "username": "user123",
  "password": "password123"
}
```

**Ejemplo de respuesta exitosa:**
```json
{
  "token": "your_jwt_token"
}
```

### **Middleware de Autenticación**

Las rutas de pago (`/payments`, `/payments/:id`, etc.) están protegidas por el middleware de autenticación. Para acceder a estas rutas, debes incluir un token JWT válido en el encabezado `Authorization` de la solicitud.

**Ejemplo de encabezado `Authorization`:**
```bash
Authorization: Bearer your_jwt_token
```

---

## **Actualización de Estado de Pago (Nuevo Módulo)**

Se ha añadido un nuevo módulo para actualizar el estado de un pago. Los pagos pueden tener tres estados posibles: `pending`, `completed`, o `refunded`.

### **Ruta `PUT /payments/:id/status`**

Esta ruta permite actualizar el estado de un pago existente.

- **Validaciones:** 
  - El valor del estado debe ser uno de los siguientes: `pending`, `completed`, `refunded`.
  - Si el estado actual es `completed`, no se puede actualizar a `completed` nuevamente.
  - Si el estado del pago es `refunded`, no se puede cambiar a otro estado.
  
**Ejemplo de solicitud:**
```json
{
  "status": "completed"
}
```

**Ejemplo de respuesta exitosa:**
```json
{
  "id": "b28311f1-4b88-4287-80dd-f9af28efaceb",
  "amount": 100.00,
  "currency": "USD",
  "status": "completed",
  "payment_method": "card",
  "customer_id": "customer123",
  "order_id": "order456",
  "createdAt": "2024-12-09T12:00:00.000Z",
  "updatedAt": "2024-12-09T12:10:00.000Z"
}
```

---

## **Reembolsos de Pagos**

La funcionalidad de reembolsos permite cambiar el estado de un pago a `refunded`. 

### **Ruta `POST /payments/:id/refund`**

Esta ruta permite marcar un pago como reembolsado, pero solo si el estado actual del pago es `completed`. Si el pago ya ha sido reembolsado, se devolverá un mensaje de error.

**Ejemplo de solicitud:**
```json
{
  "reason": "Customer requested a refund"
}
```

**Ejemplo de respuesta exitosa:**
```json
{
  "id": "b28311f1-4b88-4287-80dd-f9af28efaceb",
  "amount": 100.00,
  "currency": "USD",
  "status": "refunded",
  "payment_method": "card",
  "customer_id": "customer123",
  "order_id": "order456",
  "createdAt": "2024-12-09T12:00:00.000Z",
  "updatedAt": "2024-12-09T12:15:00.000Z"
}
```

---

## **Ejecución de Pruebas**

1. **Ejecutar las pruebas unitarias y de integración:**
   ```bash
   npm test
   ```

2. **El servidor estará disponible en:**
   Verificar cobertura de pruebas: Asegúrate de que todas las rutas y funciones sean probadas correctamente.

---

## **Estructura del Proyecto**

```plaintext
payments-service/
├── src/
│   ├── controllers/          # Controladores de las rutas.
│   │   └── paymentController.js 
|      |   └── authController.js
│   ├── middleware/ 
│   │   └── authMiddleware.js
│   ├── models/               # Modelos de datos.
│   │   └── payment.js
│   │   └── user.js
│   ├── routes/               # Definición de las rutas.
│   │   └── paymentRoutes.js
│   │   └── authRoutes.js
│   ├── services/             # Servicios para lógica de negocio (opcional).
│   ├── utils/                # Funciones de utilidad (ej.: manejo de errores).
│   ├── config.js             # Configuración de la base de datos.
│   └── server.js             # Punto de entrada del servidor.
├── tests/                    # Pruebas unitarias e integración.
│   └── payment.test.js
├── payments.db               # Base de datos SQLite (creada automáticamente).
├── package.json              # Dependencias y configuración de NPM.
├── README.md                 # Documentación del proyecto.
└── .env                      # Variables de entorno.
```

## **Licencia**

Este proyecto está licenciado bajo la MIT License.
```