import { grupoResumenActividadDTOResponse } from "./grupoResumenActividadDTOResponse";
import { grupoResumenDTOResponse } from "./grupoResumenDTOResponse";

export interface actividadGrupoAgrupadaDTOResponse{
    titulo:string,
    descripcion: string,
    campo:string,
    grupos: grupoResumenActividadDTOResponse[]
}