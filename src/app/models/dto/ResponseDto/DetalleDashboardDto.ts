export interface DetalleDashboardDto{
    idDetalleSeguimiento : number,
    estadoSemana: string,
    avanceReal: number,
    observacionesAlumno : string
    tituloActividad: String,
    avanceGlobalActividad : number
    idActividadAlumno : number
    requiereEntrega : Boolean
    avanceEsperado: number,
}