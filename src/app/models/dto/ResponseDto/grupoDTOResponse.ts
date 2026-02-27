import { Estado } from "../../enum/Estado";

export interface grupoDTOResponse{
    idGrupo? : number;
    nombre : string;
    estado : string;
    created_at : string;
    periodo : string;
    idCurso? : string;
    nombreCurso : string;
    idUsuario? : number;
    docente : string;
}