import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { actividadAlumnoDTOResponse } from '../models/dto/ResponseDto/actividadAlumnoDTOResponse';
import { cambiarEstadoTareaDTO } from '../models/dto/RequestDto/cambiarEstadoTareaDTO';

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

}
