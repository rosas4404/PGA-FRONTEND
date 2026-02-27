import { actividadBaseDTOResponse } from "./actividadBaseDTOResponse";

export interface cursoDTOResponse{
    idCurso : number;
    nombre : string;
    descripcion : string;
    fechaAlta : string;
    fechaBaja : string;
    activo : boolean;
    actividades : actividadBaseDTOResponse[];
}