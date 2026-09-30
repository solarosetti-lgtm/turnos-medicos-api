import fs from 'fs';
import path from 'path';

const rutaprofesionales = path.resolve('src', 'data', 'profesionales.json');

const rutaespecialidades = path.resolve('src', 'data', 'especialidades.json');

const dataprofesionales = fs.readFileSync(rutaprofesionales, 'utf-8');

const dataespecialidades = fs.readFileSync(rutaespecialidades, 'utf-8');

export const arrayprofesionales = JSON.parse(dataprofesionales);
console.log("PROFESIONAL CARGADO:", arrayprofesionales[0]);

export const arrayespecialidades = JSON.parse(dataespecialidades);

interface parametria {

    fechamaxima: string;
    horaminima: string;
    horamaxima: string;

}

export const configuracionagenda: parametria = {

    fechamaxima: "2026-12-30",
    horaminima: "07:00",
    horamaxima: "13:00"
};
export type especialidad = {
    especialidadId: number;
    nombreEspecialidad: string;
    activa: boolean

};
