import { Request, Response } from 'express';


// GET - Página de bienvenida
export const bienvenida = async (
    req: Request,
    res: Response
) => {
    let status = 200;

    try {
        return res.status(status).json({
            sources: true,
            message: 'bienvenidos al servicio web de medturnos.'
        });

    } catch (error: any) {
        status = 500;

        return res.status(status).json({
            mensaje: 'Error inesperado en la ruta principal',
            error: error.message
        });
    }
};


// Middleware - Ruta no encontrada
export const rutaNoEncontrada = async (
    req: Request,
    res: Response
) => {
    let status = 404;

    try {
        return res.status(status).json({
            mensaje: 'Ruta no encontrada o método HTTP no permitido',
            path: req.originalUrl,
            method: req.method
        });

    } catch (error: any) {
        status = 500;

        return res.status(status).json({
            mensaje: 'Error inesperado',
            error: error.message
        });
    }
};