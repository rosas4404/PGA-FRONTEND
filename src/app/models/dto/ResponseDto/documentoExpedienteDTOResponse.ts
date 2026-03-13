import { estadoDocumento } from "../../enum/estadoDocumento";

export interface documentoExpedienteDTOResponse{
    idDocumentoExpediente : number,
    tipoDocumento : string,
    estadoDocumento : estadoDocumento,
    urlDocumento : string,
    fechaCarga : string,
    observacion : string,
    fechaRevision : string
}