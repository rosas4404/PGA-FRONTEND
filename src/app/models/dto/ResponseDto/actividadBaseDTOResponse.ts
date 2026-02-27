import { campoDTOResponse } from "./campoDTOResponse";

export interface actividadBaseDTOResponse{
    idActividad : number;
    titulo : string;
    descripcion : string;
    activo : boolean;
    campoFormativo: campoDTOResponse;
}