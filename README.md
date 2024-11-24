# Payments Microservice

Este es un microservicio de pagos desarrollado en **Node.js** con **Express** y utiliza **SQLite** como base de datos para almacenar la información de los pagos. Es parte de una arquitectura de microservicios diseñada para integrarse con servicios relacionados como pedidos, inventario, clientes y compras.

---

## **Descripción del Proyecto**

El microservicio permite:

- Procesar pagos, almacenarlos y actualizar su estado.
- Gestionar reembolsos de transacciones.
- Consultar información sobre pagos realizados.
- Proveer integración con otros microservicios a través de HTTP.

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
   npm install

3. **Configurar variables de entorno:**
   Crear un archivo .env en el directorio raíz con el siguiente contenido:
   NODE_ENV=development
   PORT=3000
   DATABASE_STORAGE=./payments.db

## **Ejecución del Proyecto**

1. **Iniciar el servidor en modo desarrollo:**
   npm run dev

2. **Iniciar el servidor en producción:**
   npm start

3. **El servidor estará disponible en:**
   http://localhost:3000

### **Tabla de Rutas principales**

| Método HTTP | Endpoint               | Descripción                                   | Parámetros                                                                                                                                                                                                                   |
|-------------|-------------------------|-----------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `POST`      | `/payments`            | Crear un nuevo pago.                          | **Body:**<br> - `amount` (float): Monto del pago.<br> - `currency` (string): Moneda utilizada (por ejemplo, USD).<br> - `payment_method` (string): Método de pago.<br> - `customer_id` (string): ID del cliente asociado.<br> - `order_id` (string): ID del pedido. |
| `GET`       | `/payments/:id`        | Consultar un pago por su ID.                  | **Path Param:**<br> - `id` (UUID): Identificador único del pago.                                                                                                                                                           |
| `POST`      | `/payments/:id/refund` | Reembolsar un pago existente.                 | **Path Param:**<br> - `id` (UUID): Identificador único del pago.<br> **Body:**<br> - `reason` (string, opcional): Motivo del reembolso.                                                                                     |
| `GET`       | `/payments`            | Listar todos los pagos (con filtros opcionales). | **Query Params:**<br> - `status` (string, opcional): Filtrar por estado del pago (`pending`, `completed`, `refunded`).<br> - `customer_id` (string, opcional): Filtrar por cliente asociado.                                |

## **Ejecución de Pruebas**

1. **Ejecutar las pruebas unitarias y de integración:**
   npm test

2. **El servidor estará disponible en:**
   Verificar cobertura de pruebas: Verificar cobertura de pruebas: Asegúrate de que todas las rutas y funciones sean probadas correctamente.

## **Estructura del Proyecto**
payments-service/
├── src/
│   ├── controllers/          # Controladores de las rutas.
│   │   └── paymentController.js
│   ├── models/               # Modelos de datos.
│   │   └── payment.js
│   ├── routes/               # Definición de las rutas.
│   │   └── paymentRoutes.js
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

## **Modelo de Arquitectura**

El microservicio sigue una arquitectura modular:

Express maneja las rutas y los controladores.
Sequelize se utiliza para interactuar con la base de datos SQLite.
La lógica está dividida en controladores (manejo de peticiones) y modelos (acceso a datos).

Client Request --> Routes --> Controllers --> Models --> Database

## **Licencia**

Este proyecto está licenciado bajo la MIT License.
