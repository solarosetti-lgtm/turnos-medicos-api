import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import {
    arrayprofesionales,
    arrayespecialidades
} from '../resources';


// GET - Listar todos los profesionales
export const listarProfesionales = async (
    req: Request,
    res: Response
) => {
    let status = 200;

    try {
        return res.status(status).json(arrayprofesionales);

    } catch (error: any) {
        if (status < 400) {
            status = 500;
        }

        return res.status(status).json({
            mensaje: 'Error al obtener profesionales',
            error: error.message
        });
    }
};


// GET - Buscar profesional por ID
export const buscarProfesional = async (
    req: Request,
    res: Response
) => {
    let status = 200;

    try {
        const profesionalId = req.params.id;

        if (!profesionalId) {
            status = 400;
            throw new Error(
                'El ID del profesional es obligatorio'
            );
        }

        const profesional = arrayprofesionales.find(
            (p: any) => p.profesionalId === profesionalId
        );

        if (!profesional) {
            status = 404;
            throw new Error(
                'Profesional no encontrado'
            );
        }

        return res.status(status).json(profesional);

    } catch (error: any) {
        if (status < 400) {
            status = 500;
        }

        return res.status(status).json({
            mensaje: error.message
        });
    }
};


// POST - Registrar nuevo profesional
export const crearProfesional = async (
    req: Request,
    res: Response
) => {
    let status = 201;

    try {
        const {
            nombre,
            apellido,
            matricula,
            especialidadId
        } = req.body;

        if (
            !nombre ||
            !apellido ||
            !matricula ||
            !especialidadId
        ) {
            status = 400;
            throw new Error(
                'Faltan datos obligatorios para registrar el profesional'
            );
        }

        const especialidad = arrayespecialidades.find(
            (e: any) =>
                e.especialidadId === especialidadId &&
                e.activa === true
        );

        if (!especialidad) {
            status = 400;
            throw new Error(
                'La especialidad indicada no existe o está inactiva'
            );
        }

        const nuevoProfesional = {
            profesionalId: randomUUID(),
            nombre: nombre,
            apellido: apellido,
            matricula: matricula,
            especialidadId: especialidadId,
            activo: true
        };

        arrayprofesionales.push(nuevoProfesional);

        return res.status(status).json(nuevoProfesional);

    } catch (error: any) {
        if (status < 400) {
            status = 500;
        }

        return res.status(status).json({
            mensaje: error.message
        });
    }
};


// PUT - Actualizar profesional
export const actualizarProfesional = async (
    req: Request,
    res: Response
) => {
    let status = 200;

    try {
        const profesionalId = req.params.id;

        if (!profesionalId) {
            status = 400;
            throw new Error(
                'El ID del profesional es obligatorio'
            );
        }

        const indice = arrayprofesionales.findIndex(
            (p: any) => p.profesionalId === profesionalId
        );

        if (indice === -1) {
            status = 404;
            throw new Error(
                'Profesional no encontrado'
            );
        }

        const {
            nombre,
            apellido,
            matricula,
            especialidadId,
            activo
        } = req.body;

        if (
            !nombre ||
            !apellido ||
            !matricula ||
            !especialidadId ||
            typeof activo !== 'boolean'
        ) {
            status = 400;
            throw new Error(
                'Faltan datos obligatorios para actualizar el profesional'
            );
        }

        const especialidad = arrayespecialidades.find(
            (e: any) =>
                e.especialidadId === especialidadId &&
                e.activa === true
        );

        if (!especialidad) {
            status = 400;
            throw new Error(
                'La especialidad indicada no existe o está inactiva'
            );
        }

        const profesionalActualizado = {
            profesionalId: profesionalId,
            nombre: nombre,
            apellido: apellido,
            matricula: matricula,
            especialidadId: especialidadId,
            activo: activo
        };

        arrayprofesionales[indice] = profesionalActualizado;

        return res.status(status).json({
            mensaje: 'Profesional actualizado correctamente',
            profesional: profesionalActualizado
        });

    } catch (error: any) {
        if (status < 400) {
            status = 500;
        }

        return res.status(status).json({
            mensaje: error.message
        });
    }
};


// DELETE - Desactivar profesional
export const desactivarProfesional = async (
    req: Request,
    res: Response
) => {
    let status = 204;

    try {
        const profesionalId = req.params.id;

        if (!profesionalId) {
            status = 400;
            throw new Error(
                'El ID del profesional es obligatorio'
            );
        }

        const profesional = arrayprofesionales.find(
            (p: any) => p.profesionalId === profesionalId
        );

        if (!profesional) {
            status = 404;
            throw new Error(
                'Profesional no encontrado'
            );
        }

        profesional.activo = false;

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