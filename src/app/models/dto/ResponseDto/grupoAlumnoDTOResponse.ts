import { Estado } from "../../enum/Estado";

export interface grupoAlumnoDTOResponse{
    idGrupo? : number;
    nombre : string;
    estado : string;
    periodo : string;
    nombreCurso : string;
    docente : string;
    idInscripcion : number;
}