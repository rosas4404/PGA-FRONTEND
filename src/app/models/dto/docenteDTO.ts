import { usuarioDTO } from "./usuarioDTO";

export interface docenteDTO{
    idDocente?:number;
    fechaAlta: string;//mismo que alumno
    fechaBaja: string;//mismo que alumno
    activo: boolean;
    usuarioDto: usuarioDTO;


}