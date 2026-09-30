import express, { Request, Response } from 'express';
import { randomUUID } from 'crypto';

import {
    arrayprofesionales,
    arrayespecialidades,
    configuracionagenda
} from './resources';

import {
    bienvenida,
    rutaNoEncontrada
} from './controllers/general.controller';

import {
    listarEspecialidades,
    buscarEspecialidad,
    crearEspecialidad,
    desactivarEspecialidad
} from './controllers/especialidades.controller';

import {
    listarProfesionales,
    buscarProfesional,
    crearProfesional,
    actualizarProfesional,
    desactivarProfesional
} from './controllers/profesionales.controller';

const app = express();

const arrayturnos: Array<{
    turnoId: string;
    profesionalId: string;
    especialidadId: string;
    paciente: string;
    fecha: string;
    horario: string;
    estado: 'reservado' | 'cancelado';
}> = [];

app.use(express.json());

app.use((req: Request, res: Response, next) => {
    console.log(`Solicitud recibida: ${req.method} ${req.originalUrl}`);
    next();
});

const mostrarEstado = (titulo: string, recurso: unknown) => {
    console.log(`Estado actualizado de ${titulo}:`);
    console.table(Array.isArray(recurso) ? recurso : [recurso]);
};

const generarHorariosDisponibles = (fecha: string) => {
    const horarios: string[] = [];

    const inicio = Number(configuracionagenda.horaminima.split(':')[0]);
    const fin = Number(configuracionagenda.horamaxima.split(':')[0]);

    for (let hora = inicio; hora < fin; hora++) {
        horarios.push(`${String(hora).padStart(2, '0')}:00`);
        horarios.push(`${String(hora).padStart(2, '0')}:30`);
    }

    const ocupados = arrayturnos
        .filter((turno) => turno.fecha === fecha && turno.estado === 'reservado')
        .map((turno) => turno.horario);

    return horarios.filter((horario) => !ocupados.includes(horario));
};

app.get('/', bienvenida);

app.get('/especialidades', listarEspecialidades);
app.get('/especialidades/:id', buscarEspecialidad);
app.post('/especialidades', crearEspecialidad);
app.delete('/especialidades/:id', desactivarEspecialidad);

app.get('/profesionales', listarProfesionales);
app.get('/profesionales/tabla', (req: Request, res: Response) => {
    try {
        const filas = arrayprofesionales
            .map(
                (profesional: any) => `
                    <tr>
                        <td>${profesional.profesionalId}</td>
                        <td>${profesional.nombre}</td>
                        <td>${profesional.apellido}</td>
                        <td>${profesional.matricula}</td>
                        <td>${profesional.especialidadId}</td>
                        <td>${profesional.activo ? 'Activo' : 'Inactivo'}</td>
                    </tr>
                `
            )
            .join('');

        return res.status(200).send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Profesionales</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 24px; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #999; padding: 8px; text-align: left; }
                    th { background: #e8e8e8; }
                </style>
            </head>
            <body>
                <h1>Profesionales</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Matrícula</th>
                            <th>Especialidad</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>${filas}</tbody>
                </table>
            </body>
            </html>
        `);
    } catch (error: any) {
        return res.status(500).json({
            mensaje: 'Error al mostrar la tabla de profesionales',
            error: error.message
        });
    }
});

app.get('/profesionales/:id', buscarProfesional);
app.post('/profesionales', crearProfesional);
app.put('/profesionales/:id', actualizarProfesional);
app.delete('/profesionales/:id', desactivarProfesional);

app.get('/agenda', (req: Request, res: Response) => {
    try {
        const profesionalesActivos = arrayprofesionales.filter(
            (profesional: any) => profesional.activo === true
        );

        const especialidadesActivas = arrayespecialidades.filter(
            (especialidad: any) => especialidad.activa === true
        );

        return res.status(200).json({
            configuracion: configuracionagenda,
            profesionales: profesionalesActivos,
            especialidades: especialidadesActivas
        });
    } catch (error: any) {
        return res.status(500).json({
            mensaje: 'Error al consultar la agenda',
            error: error.message
        });
    }
});

app.get('/agenda/:profesionalId/:fecha', (req: Request, res: Response) => {
    try {
        const profesionalId = Array.isArray(req.params.profesionalId)
            ? req.params.profesionalId[0]
            : req.params.profesionalId;

        const fecha = Array.isArray(req.params.fecha)
            ? req.params.fecha[0]
            : req.params.fecha;

        const profesional = arrayprofesionales.find(
            (item: any) => item.profesionalId === profesionalId && item.activo === true
        );

        if (!profesional) {
            return res.status(404).json({
                mensaje: 'Profesional no encontrado o inactivo'
            });
        }

        if (fecha > configuracionagenda.fechamaxima) {
            return res.status(400).json({
                mensaje: 'La fecha solicitada supera la fecha máxima permitida'
            });
        }

        return res.status(200).json({
            profesional,
            fecha,
            horariosDisponibles: generarHorariosDisponibles(fecha)
        });
    } catch (error: any) {
        return res.status(500).json({
            mensaje: 'Error al consultar la agenda del profesional',
            error: error.message
        });
    }
});

app.get('/turnos', (req: Request, res: Response) => {
    try {
        return res.status(200).json(arrayturnos);
    } catch (error: any) {
        return res.status(500).json({
            mensaje: 'Error al obtener turnos',
            error: error.message
        });
    }
});

app.get('/turnos/:id', (req: Request, res: Response) => {
    try {
        const turno = arrayturnos.find((item) => item.turnoId === req.params.id);

        if (!turno) {
            return res.status(404).json({
                mensaje: 'Turno no encontrado'
            });
        }

        return res.status(200).json(turno);
    } catch (error: any) {
        return res.status(500).json({
            mensaje: 'Error al buscar el turno',
            error: error.message
        });
    }
});

app.post('/turnos', (req: Request, res: Response) => {
    try {
        const { profesionalId, especialidadId, paciente, fecha, horario } = req.body;

        if (!profesionalId || !especialidadId || !paciente || !fecha || !horario) {
            return res.status(400).json({
                mensaje: 'Faltan datos obligatorios para crear el turno'
            });
        }

        const profesional = arrayprofesionales.find(
            (item: any) => item.profesionalId === profesionalId && item.activo === true
        );

        if (!profesional) {
            return res.status(400).json({
                mensaje: 'El profesional indicado no existe o está inactivo'
            });
        }

        const especialidad = arrayespecialidades.find(
            (item: any) => item.especialidadId === especialidadId && item.activa === true
        );

        if (!especialidad) {
            return res.status(400).json({
                mensaje: 'La especialidad indicada no existe o está inactiva'
            });
        }

        const horariosDisponibles = generarHorariosDisponibles(fecha);

        if (!horariosDisponibles.includes(horario)) {
            return res.status(409).json({
                mensaje: 'El horario no está disponible para la fecha indicada'
            });
        }

        const turnoExistente = arrayturnos.find(
            (item) =>
                item.profesionalId === profesionalId &&
                item.fecha === fecha &&
                item.horario === horario &&
                item.estado === 'reservado'
        );

        if (turnoExistente) {
            return res.status(409).json({
                mensaje: 'El horario ya está ocupado para ese profesional en esa fecha'
            });
        }

        const nuevoTurno = {
            turnoId: randomUUID(),
            profesionalId,
            especialidadId,
            paciente,
            fecha,
            horario,
            estado: 'reservado' as const
        };

        arrayturnos.push(nuevoTurno);
        mostrarEstado('Turnos', arrayturnos);

        return res.status(201).json({
            mensaje: 'Turno reservado correctamente',
            turno: nuevoTurno
        });
    } catch (error: any) {
        return res.status(500).json({
            mensaje: 'Error al crear el turno',
            error: error.message
        });
    }
});

app.delete('/turnos/:id', (req: Request, res: Response) => {
    try {
        const turno = arrayturnos.find((item) => item.turnoId === req.params.id);

        if (!turno) {
            return res.status(404).json({
                mensaje: 'Turno no encontrado'
            });
        }

        turno.estado = 'cancelado';
        mostrarEstado('Turnos', arrayturnos);

        return res.status(200).json({
            mensaje: 'Turno cancelado correctamente',
            turno
        });
    } catch (error: any) {
        return res.status(500).json({
            mensaje: 'Error al cancelar el turno',
            error: error.message
        });
    }
});

app.use(rutaNoEncontrada);

export default app;
