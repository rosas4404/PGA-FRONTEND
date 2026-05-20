import { ActividadAlumnoDto } from "../actividadAlumnoDto"

export interface SemanaResponseDto {
    idSeguimientoSemanal: number,
    numeroSemana : number
    semanaInicio : string,
    semanaFin : string,
    fechaLimiteEdicion : string,
    porcentajeAvance : number,
    idInscripción : number,

    actividadesSugeridas : ActividadAlumnoDto[] 
}