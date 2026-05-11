export interface ActividadAlumnoDto {
    idActividadAlumno : number,
    estadoTarea : string,
    comentarios : string,
    excento : string,
    motivoExencion : string,
    urlEntrega : string,
    fechaEntrega : string,
    observaciones : string,
    avanceGlobal : number,

    idInscripcion : number

    titulo : string,
    descripcion : string,
    campoFormativo : string,
    origen : string,
    urlInstrucciones : string,
    fechaAsignacion : string,
    reqEntrega : Boolean
}