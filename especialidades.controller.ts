import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { arrayespecialidades } from '../resources';


// GET - Listar todas las especialidades
export const listarEspecialidades = async (
    req: Request,
    res: Response
) => {
    let status = 200;

    try {
        return res.status(status).json(arrayespecialidades);

    } catch (error: any) {
        if (status < 400) {
            status = 500;
        }

        return res.status(status).json({
            mensaje: 'Error al obtener especialidades',
            error: error.message
        });
    }
};


// GET - Buscar especialidad por ID
export const buscarEspecialidad = async (
    req: Request,
    res: Response
) => {
    let status = 200;

    try {
        const especialidadId = req.params.id;

        if (!especialidadId) {
            status = 400;
            throw new Error(
                'El ID de la especialidad es obligatorio'
            );
        }

        const especialidad = arrayespecialidades.find(
            (e: any) => e.especialidadId === especialidadId
        );

        if (!especialidad) {
            status = 404;
            throw new Error(
                'Especialidad no encontrada'
            );
        }

        return res.status(status).json(especialidad);

    } catch (error: any) {
        if (status < 400) {
            status = 500;
        }

        return res.status(status).json({
            mensaje: error.message
        });
    }
};


// POST - Crear nueva especialidad
export const crearEspecialidad = async (
    req: Request,
    res: Response
) => {
    let status = 201;

    try {
        const { nombre } = req.body;

        if (!nombre) {
            status = 400;
            throw new Error(
                'El nombre de la especialidad es obligatorio'
            );
        }

        const nuevaEspecialidad = {
            especialidadId: randomUUID(),
            nombre: nombre,
            activa: true
        };

        arrayespecialidades.push(nuevaEspecialidad);

        return res.status(status).json(nuevaEspecialidad);

    } catch (error: any) {
        if (status < 400) {
            status = 500;
        }

        return res.status(status).json({
            mensaje: error.message
        });
    }
};


// DELETE - Desactivar especialidad
export const desactivarEspecialidad = async (
    req: Request,
    res: Response
) => {
    let status = 204;

    try {
        const especialidadId = req.params.id;

        if (!especialidadId) {
            status = 400;
            throw new Error(
                'El ID de la especialidad es obligatorio'
            );
        }

        const especialidad = arrayespecialidades.find(
            (e: any) => e.especialidadId === especialidadId
        );

        if (!especialidad) {
            status = 404;
            throw new Error(
                'Especialidad no encontrada'
            );
        }

        especialidad.activa = false;

        return res.status(status).send();

    } catch (error: any) {
        if (status < 400) {
            status = 500;
        }

        return res.status(status).json({
            mensaje: error.message
        });
    }
};

