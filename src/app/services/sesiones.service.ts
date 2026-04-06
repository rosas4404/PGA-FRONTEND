import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';
import { Observable } from 'rxjs';
import { sesionDocenteDTOResponse } from '../models/dto/ResponseDto/sesionDocenteDTOResponse';
import { sesionDTORequest } from '../models/dto/RequestDto/sesionDTORequest';
import { sesionDTO } from '../models/dto/ResponseDto/sesionDTO';
import { sesionDetalleDTO } from '../models/dto/ResponseDto/sesionDetalleDTO';
import { sesionUpdateDTO } from '../models/dto/RequestDto/sesionUpdateDTO';
import { PageResponse } from '../models/pageResponse';

@Injectable({
  providedIn: 'root'
})
export class SesionesService {

  private apiUrl: string = `${baseUrl}/sesiones`;
  constructor(private httpClient : HttpClient) { }

  //crear sesion
  crearSesion(idGrupo: number, sesionDTORequest:sesionDTORequest):Observable<sesionDTO>{
    const id = Number(idGrupo); 
    if (isNaN(id)) {
      console.error("Error: idGrupo no es un número válido", idGrupo);
    }
    return this.httpClient.post<sesionDTO>(`${this.apiUrl}/grupo/${idGrupo}`, sesionDTORequest);
  } 

  //actualizar la lista de inscrpciones en alcance individual
  actualizarInscripciones(idSesion: number, ids: number[]): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/${idSesion}/inscripciones`, ids);
  }

  //tomar asistencia


  //detalles de asistencia por grupo
  obtenerDetallesSesion(idSesion: number):Observable<sesionDetalleDTO>{
    return this.httpClient.get<sesionDetalleDTO>(`${this.apiUrl}/asistencia/${idSesion}`);
  }
 

  //consultar sesiones por grupo
  obtenerSesionesPorGrupo(idGrupo : number)  : Observable <sesionDTO[]> {
    return this.httpClient.get<sesionDTO[]>(`${this.apiUrl}/porGrupo/${idGrupo}`);
  }

  //consultar sesiones por docente
  obtenerSesionesDocente(idDocente : number)  : Observable <sesionDocenteDTOResponse[]> {
    return this.httpClient.get<sesionDocenteDTOResponse[]>(`${this.apiUrl}/porDocente/${idDocente}`);
  }

  //consultar sesiones por alumno
  obtenerSesionesAlumno(idInscripcion : number)  : Observable <sesionDocenteDTOResponse[]> {
    return this.httpClient.get<sesionDocenteDTOResponse[]>(`${this.apiUrl}/porAlumno/${idInscripcion}`);
  }

  //actualizar detalles de la sesion
  actualizarDetalleSesion(idSesion : number, sesionUpdateDTO:sesionUpdateDTO)  : Observable <sesionDetalleDTO> {
    return this.httpClient.put<sesionDetalleDTO>(`${this.apiUrl}/actualizar/${idSesion}`, sesionUpdateDTO);
  }

  //reporte de asistencias por grupo 
  consultaGeneralPage(idDocente:number, page: number,size: number,filtros?: any): Observable<PageResponse<sesionDocenteDTOResponse>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (filtros) {
      if (filtros.idDocente) {
        params = params.set('idDocente', filtros.idDocente);
      }
      if (filtros.idGrupo) {
        params = params.set('idGrupo', filtros.idGrupo);
      }
      if (filtros.momentoSesion) {
        params = params.set('momentoSesion', filtros.momentoSesion);
      }
      if (filtros.alcance) {
        params = params.set('alcance', filtros.alcance);
      }
    }

    return this.httpClient.get<PageResponse<sesionDocenteDTOResponse>>(`${this.apiUrl}/docente/${idDocente}/sesiones`,{ params });}

}
