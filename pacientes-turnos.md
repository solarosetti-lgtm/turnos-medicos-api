# Propuesta de módulo: Pacientes y Turnos

## 1. Introducción

El presente documento define una propuesta conceptual y técnica para incorporar al sistema TurnosMed los módulos de Pacientes y Turnos.

La propuesta tiene como objetivo establecer los datos mínimos necesarios para registrar pacientes y asignar turnos médicos, definiendo interfaces RESTful que permitan al equipo de Frontend integrar posteriormente estas funcionalidades.

El diseño sigue los principios de separación de responsabilidades utilizados en la arquitectura actual del proyecto.

---

# 2. Entidad Paciente

## 2.1 Modelado conceptual

La entidad Paciente representa a la persona que solicita y utiliza los servicios médicos del sistema.

Para registrar un paciente se consideran necesarios los siguientes datos:

| Campo | Tipo | Descripción | Obligatorio |
|---|---|---|---|
| pacienteId | string | Identificador único del paciente | Sí |
| dni | string | Documento Nacional de Identidad | Sí |
| nombre | string | Nombre del paciente | Sí |
| apellido | string | Apellido del paciente | Sí |
| fechaNacimiento | string | Fecha de nacimiento | Sí |
| telefono | string | Número de teléfono de contacto | Sí |
| email | string | Correo electrónico | No |
| activo | boolean | Indica si el paciente se encuentra activo | Sí |

El campo `pacienteId` permite identificar de manera única al paciente dentro del sistema.

El campo `dni` permite identificar al paciente mediante su documento y debería ser único.

El atributo `activo` permite realizar una baja lógica sin eliminar físicamente el registro.

---

# 3. Entidad Turno

## 3.1 Modelado conceptual

La entidad Turno representa una reserva de atención médica entre un paciente y un profesional.

Para asignar un turno se consideran necesarios los siguientes datos:

| Campo | Tipo | Descripción | Obligatorio |
|---|---|---|---|
| turnoId | string | Identificador único del turno | Sí |
| pacienteId | string | Identificador del paciente | Sí |
| profesionalId | string | Identificador del profesional | Sí |
| especialidadId | string | Identificador de la especialidad médica | Sí |
| fecha | string | Fecha del turno | Sí |
| horario | string | Hora del turno | Sí |
| estado | string | Estado actual del turno | Sí |

Los campos `pacienteId`, `profesionalId` y `especialidadId` permiten relacionar el turno con las entidades correspondientes.

El campo `estado` permite identificar la situación del turno. Para el sistema se contemplan inicialmente los estados:

- `reservado`
- `cancelado`

---

# 4. Relaciones entre las entidades

El modelo propuesto establece las siguientes relaciones:

- Un paciente puede tener múltiples turnos.
- Un profesional puede tener múltiples turnos.
- Una especialidad puede estar asociada a múltiples profesionales y turnos.
- Cada turno corresponde a un único paciente.
- Cada turno corresponde a un único profesional.
- Cada turno corresponde a una única especialidad.

De esta manera, el turno funciona como vínculo entre el paciente y el profesional que realizará la atención médica.

---

# 5. Propuesta de endpoints RESTful

Para esta etapa se proponen dos nuevos endpoints principales, uno para cada entidad.

## 5.1 Registrar paciente

### Método

`POST`

### Path

```text
/pacientes

# 3. Entidad Turno

## 3.1 Modelado conceptual

La entidad Turno representa una reserva de atención médica entre un paciente y un profesional.

Para asignar un turno se consideran necesarios los siguientes datos:

| Campo | Tipo | Descripción | Obligatorio |
|---|---|---|---|
| turnoId | string | Identificador único del turno | Sí |
| pacienteId | string | Identificador del paciente | Sí |
| profesionalId | string | Identificador del profesional | Sí |
| especialidadId | string | Identificador de la especialidad médica | Sí |
| fecha | string | Fecha del turno | Sí |
| horario | string | Hora del turno | Sí |
| estado | string | Estado actual del turno | Sí |

Los campos `pacienteId`, `profesionalId` y `especialidadId` permiten relacionar el turno con las entidades correspondientes.

El campo `estado` permite identificar la situación del turno. Para el sistema se contemplan inicialmente los estados:

- `reservado`
- `cancelado`

# 4. Relaciones entre las entidades

El modelo propuesto establece las siguientes relaciones:

- Un paciente puede tener múltiples turnos.
- Un profesional puede tener múltiples turnos.
- Una especialidad puede estar asociada a múltiples profesionales y turnos.
- Cada turno corresponde a un único paciente.
- Cada turno corresponde a un único profesional.
- Cada turno corresponde a una única especialidad.

De esta manera, el turno funciona como vínculo entre el paciente y el profesional que realizará la atención médica.

# 5. Propuesta de endpoints RESTful

## 5.1 Registrar paciente

### Método

`POST`

### Path

```text
/pacientes

## 5.2 Registrar turno

### Método

`POST`

### Path

```text
/turnos

# 6. Consideraciones de arquitectura

Los endpoints propuestos deberán seguir la misma separación de responsabilidades implementada en la API actual.

En una futura implementación, los controladores podrían organizarse de la siguiente manera:

```text
src/
├── controllers/
│   ├── pacientes.controller.ts
│   ├── turnos.controller.ts
│   ├── profesionales.controller.ts
│   ├── especialidades.controller.ts
│   └── general.controller.ts
