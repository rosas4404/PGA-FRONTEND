import { estadoTarea } from "../../enum/estadoTarea";

export interface actividadAlumnoDTO {
        idActividadAlumno : number,
        estadoTarea : estadoTarea,
        comentarios : string,
        excento : Boolean,
        motivoExencion : string,
        urlEntrega : string,
        fechaEntrega : string,
        observaciones : string,
        avanceGlobal : number,

        idInscripcion : number,

        titulo : string,
        descripcion : string,
        campoFormativo: string,
        origen : string,
        urlInstrucciones : string,
        fechaAsignacion : string,
        reqEntrega : Boolean

        seguimientoActivo: Boolean
}