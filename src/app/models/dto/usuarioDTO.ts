export interface usuarioDTO{
  rol: 'ALUMNO' | 'DOCENTE';
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  telefono: string;
  direccion: string;

}