# Turnos Médicos

## Descripción

Proyecto backend desarrollado para la gestión de turnos médicos.

El sistema utiliza datos iniciales simulados para representar especialidades médicas y profesionales, permitiendo trabajar con información estructurada en archivos JSON.

En la Actividad 3 se realizó una refactorización de la API mediante la separación de responsabilidades en Controllers, manteniendo el funcionamiento de los endpoints y realizando pruebas de regresión mediante Postman.

## Tecnologías utilizadas

- Node.js
- TypeScript
- Express
- JSON
- Node.js `fs`
- Postman

## Estructura del proyecto

```text
src/
├── controllers/
│   ├── especialidades.controller.ts
│   ├── profesionales.controller.ts
│   └── general.controller.ts
│
├── data/
│   ├── especialidades.json
│   └── profesionales.json
│
├── index.ts
└── resources.ts

package.json
tsconfig.json
README.md

## 4. Arquitectura

El proyecto utiliza una organización basada en la separación de responsabilidades mediante Controllers.

Los controladores se encargan de recibir las solicitudes HTTP, validar los datos necesarios, ejecutar las operaciones correspondientes y generar las respuestas de la API.

La organización actual permite mantener separada la lógica de cada recurso y facilita el mantenimiento y las futuras ampliaciones del sistema.

## 5. Instalación

Para ejecutar el proyecto es necesario contar con Node.js instalado.

Clonar o descargar el proyecto y acceder a la carpeta raíz desde una terminal.

Instalar las dependencias mediante:

```bash
npm install


### 3. Ahora agregá solamente esto

Debajo de ese bloque, agregá:

```markdown
## 6. Ejecución

Para iniciar el servidor en modo desarrollo se utiliza:

```bash
npm run dev

## 7. Endpoints de la API

### Especialidades

#### GET /especialidades

Obtiene el listado de todas las especialidades médicas.

**Respuesta exitosa:**
- `200 OK`

Ejemplo:

```json
[
  {
    "especialidadId": "550e8400-e29b-41d4-a716-446655440001",
    "nombre": "Cardiología",
    "activa": true
  }
]

### Agenda

#### GET /agenda

Obtiene la configuración general de la agenda médica.

**Respuesta exitosa:**
- `200 OK`

La respuesta contiene la fecha máxima disponible y el rango horario de atención.

#### GET /agenda/:profesionalId/:fecha

Obtiene la disponibilidad de un profesional para una fecha determinada.

**Parámetros de ruta:**
- `profesionalId`: identificador del profesional.
- `fecha`: fecha a consultar.

**Respuestas:**
- `200 OK`: disponibilidad obtenida correctamente.
- `404 Not Found`: profesional inexistente o sin disponibilidad.

### Turnos

#### GET /turnos

Obtiene el listado de turnos registrados.

**Respuesta exitosa:**
- `200 OK`

#### GET /turnos/:id

Obtiene un turno específico mediante su identificador.

**Parámetro de ruta:**
- `id`: identificador del turno.

**Respuestas:**
- `200 OK`: turno encontrado.
- `404 Not Found`: turno inexistente.

#### POST /turnos

Registra un nuevo turno médico.

**Body JSON:**

```json
{
  "profesionalId": "650e8400-e29b-41d4-a716-446655440001",
  "especialidadId": "550e8400-e29b-41d4-a716-446655440001",
  "paciente": "María Gómez",
  "fecha": "2026-10-15",
  "horario": "08:00"
}

## 8. Manejo de errores

La API utiliza códigos de estado HTTP para informar el resultado de cada operación.

Los principales códigos utilizados son:

- `200 OK`: solicitud procesada correctamente.
- `201 Created`: recurso creado correctamente.
- `400 Bad Request`: los datos enviados no son válidos o están incompletos.
- `404 Not Found`: el recurso solicitado no existe.
- `409 Conflict`: existe un conflicto con los datos enviados.

Las rutas no definidas también devuelven una respuesta `404 Not Found`.

## 9. Pruebas de integración con Postman

Las pruebas de integración de la API se realizan mediante Postman.

Para evitar repetir la dirección del servidor en cada solicitud se utiliza una variable de entorno:

```text
baseUrl = http://localhost:3000



