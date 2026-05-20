import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { actividadAlumnoDTOResponse } from '../models/dto/ResponseDto/actividadAlumnoDTOResponse';
import { cambiarEstadoTareaDTO } from '../models/dto/RequestDto/cambiarEstadoTareaDTO';
import { actividadAlumnoListaDTO } from '../models/dto/ResponseDto/actividadAlumnoListaDTO';
import { actividadAlumnoDTO } from '../models/dto/ResponseDto/actividadalumnoDTO';

@Injectable({
  providedIn: 'root'
})
export class ActividadAlumnoService {

    private apiUrl: string = 'http://localhost:8080/api/actividades-alumnos';
    private httpHeaders = new HttpHeaders({'Content-Type' : 'application/json'});

  constructor(private httpClient: HttpClient) { }

  obtenerAsignaciones(idActividadGrupo :  number) : Observable <actividadAlumnoDTOResponse[]>{
    return this.httpClient.get<actividadAlumnoDTOResponse[]>(`${this.apiUrl}/actividad/${idActividadGrupo}`);
  }

  exentarActividad(idActividad : number, dto : cambiarEstadoTareaDTO) {
    return this.httpClient.put(`${this.apiUrl}/${idActividad}/exentar`, dto);
  }

  calificarEntrega(idActividadAlumno : number, dto : cambiarEstadoTareaDTO) : Observable<actividadAlumnoDTOResponse>{
    return this.httpClient.put<actividadAlumnoDTOResponse>(`${this.apiUrl}/${idActividadAlumno}/observacion`, dto)
  }

  //obtener lista de actividades por inscripcion
  obtenerActividadesPorInscripcion(idInscripcion: number): Observable<actividadAlumnoListaDTO[]>{
    return this.httpClient.get<actividadAlumnoListaDTO[]>(`${this.apiUrl}/inscripcion/${idInscripcion}`);
  }
   //obtener lista de actividades por inscripcion disponibles
  obtenerActividadesPorInscripcionDisponibles(idInscripcion: number): Observable<actividadAlumnoListaDTO[]>{
    return this.httpClient.get<actividadAlumnoListaDTO[]>(`${this.apiUrl}/inscripcion/${idInscripcion}`);
  }

  //obtener actividad por inscripcion 
  obtenerActividadPorInscripcion(idInscripcion: number, idActividadAlumno: number): Observable<actividadAlumnoDTO>{
    return this.httpClient.get<actividadAlumnoDTO>(`${this.apiUrl}/inscripcion/${idInscripcion}/${idActividadAlumno}`);
  }

 //subir documento
  subirDocumento(idActividadAlumno:number, archivo:File): Observable<void>{
    const formData = new FormData();//envia archivos al back usando multipart/form-data
    formData.append('archivo',archivo);//agrega el archivo al formdata
    return this.httpClient.post<void>(`${this.apiUrl}/${idActividadAlumno}/entrega`, formData);
  }
  
  //visualizar documentos
  visualizarDocumento(idActividadAlumno: number):Observable<Blob>{//NOTA: el blob es un tipo de dato que representa archivos binarios o datos crudos inmutables de tamaño arbitrario (imagenes videos, etc)
    return this.httpClient.get(`${this.apiUrl}/${idActividadAlumno}/entrega`, {responseType:'blob'});
  }

}
