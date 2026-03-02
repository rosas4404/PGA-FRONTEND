export interface usuarioDTOResponse{
    idUsuario? : number;
    nombre : string;
    apellidoPaterno : string;
    apellidoMaterno : string;
    created_At : string;
    telefono : string;
    nombreCurso : string;
    direccion : string;
    activo : boolean;
    fechaAlta : string;
    fechaBaja : string;
}