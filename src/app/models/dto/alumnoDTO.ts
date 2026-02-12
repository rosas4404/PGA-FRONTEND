import { usuarioDTO } from "./usuarioDTO";

export interface alumnoDTO{
    idAlumno: number;
    univerdiad: string;
    carrera: string;
    fechaTermino: string;
    fechaAlta: string;
    fechaBaja: string;
    activo: boolean;
    usuarioDto:usuarioDTO;
}