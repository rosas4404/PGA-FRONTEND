import { estadoExpediente } from "../../enum/estadoExpediente";
import { documentoExpedienteDTOResponse } from "./documentoExpedienteDTOResponse";

export interface expedienteDTOResponse{
    idExpediente : number,
    idAlumno : number,
    estado : estadoExpediente,
    observaciones : string,
    documentos : documentoExpedienteDTOResponse[]
}