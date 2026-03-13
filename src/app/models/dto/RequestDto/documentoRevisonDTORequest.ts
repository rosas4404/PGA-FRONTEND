import { estadoDocumento } from "../../enum/estadoDocumento";

export interface docuemntoRevisionDTORequest{
    estadoDocumento: estadoDocumento,
    observacion: string
}