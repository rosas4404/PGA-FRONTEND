export interface usuarioDTO{
  tipo: 'ALUMNO' | 'DOCENTE';

  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  telefono: string;
  direccion: string;

  password: string;
  confirmPassword: string;

  // Campos opcionales
  universidad?: string;
  carrera?: string;
  fechaTermino?: Date;
}