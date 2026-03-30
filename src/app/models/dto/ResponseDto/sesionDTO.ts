import { Alcance } from "../../enum/alcance";
import { grupoDTOResponse } from "./grupoDTOResponse";

export interface sesionDTO{
    idSesion : number;
    fecha : string;
    tema : string;
    urlSesion : string;
    alcance : Alcance;
    plataforma : string;
    grupo: grupoDTOResponse;
}