import { Tipo } from "../../enum/tipo";

export interface InscripcionResponseDTO{
        idInscripcion : number,

        fechaInscripcion: string,
      
        fechaInicio: string,
       
        fechaFin : string,
        fechaBaja : string, 
        estado : boolean,
        escuela : string,
        nivelEstudio : string,
        carrera : string,
        tipo : Tipo,
        alumno : string,
        idUsuario: number,
        idGrupo : number,
        nombreGrupo : string
}