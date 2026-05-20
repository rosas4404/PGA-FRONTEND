import { DetalleDashboardDto } from "./DetalleDashboardDto";

export interface SeguimientoDashboardResponseDto {
    idSeguimientoSemanal : number,
    numeroSemana : number,
    semanaInicio : string,
    semanaFin : string,
    fechaLimiteEdicion : string,
    porcentajeAvance : number,
    detalles : DetalleDashboardDto[]
}