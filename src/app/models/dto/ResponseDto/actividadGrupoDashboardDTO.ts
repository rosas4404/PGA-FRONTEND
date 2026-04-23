export interface actividadGrupoDashboardDTO {
    idActividadGrupo: number,
    titulo: string
    descripcion: string,
    fechaAsignacion: string,
    reqEntrega: Boolean,
    alcance: string,
    idGrupo: number,
    nombreGrupo: string,
    campo: string,
    origen : string,
    urlInstrucciones : string,
    asignadas: number,
    entregadas: number,
    aprobadas: number,
    incompletas: number,
    excentadas: number
    progreso : number,
    espera : number,
    noIniciadas : number
}