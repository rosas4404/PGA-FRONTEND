export interface DetalleDashboardDto{
    idDetalleSeguimiento : number,
    estadoSemana: string,
    avanceSemanal: number,
    observacionesAlumno : string
    tituloActividad: String,
    avanceGlobalActividad : number
    idActividadAlumno : number
    requiereEntrega : Boolean
}