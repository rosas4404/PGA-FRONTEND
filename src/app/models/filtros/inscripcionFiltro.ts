import { Tipo } from "../enum/tipo";

export interface InscripcionFiltro{
    estado : boolean | null ;
    tipo : Tipo | null;
    alumno : string | null;
    idGrupo : number | null;
}