import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';
import { InscripcionResponseDTO } from '../models/dto/ResponseDto/inscripcionResponseDTO';
import { InscripcionFiltro } from '../models/filtros/inscripcionFiltro';
import { PageResponse } from '../models/pageable/PageResponseDTO';
import { crearInscripcionDTO } from '../models/dto/RequestDto/crearInscripcionDTO';
import { asignarGrupoDTO } from '../models/asignarGrupoDTO';
import { Observable } from 'rxjs';
import { alumnoGrupoDTOResponse } from '../models/dto/ResponseDto/alumnoGrupoDTOResponse';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {

  private baseUrl =`${baseUrl}/inscripcion`;
  private httpHeaders= new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private httpClient: HttpClient) {}

  //

  obtenerInscripciones(page: number, size: number, filtros:InscripcionFiltro) : Observable <PageResponse<InscripcionResponseDTO>>{
    let params= new HttpParams()
    .set ('page', page.toString())
    .set('size', size.toString());

    if(filtros.estado !== null && filtros.estado != undefined){
      params = params.set('estado', filtros.estado.toString());
    }
    if(filtros.tipo !== null && filtros.tipo != undefined){
      params = params.set('tipo', filtros.tipo.toString())
    }
    if(filtros.alumno !== null && filtros.alumno != undefined){
      params = params.set('alumno', filtros.alumno.toString())
    }
    if(filtros.idGrupo !== null && filtros.idGrupo != undefined){
      params = params.set('idGrupo', filtros.idGrupo.toString())
    }

    return this.httpClient.get<PageResponse<InscripcionResponseDTO>>(this.baseUrl, { params });
  }



  //crear inscripción
  crear (crearInscripcionDto: crearInscripcionDTO): Observable <InscripcionResponseDTO> {
    return this.httpClient.post<InscripcionResponseDTO>(this.baseUrl,crearInscripcionDto);
  }

  asignar (asignarGrupoDto:asignarGrupoDTO) : Observable <any> {
    return this.httpClient.put<any>(`${this.baseUrl}/${asignarGrupoDto.idInscripcion}/asignarGrupo/${asignarGrupoDto.idGrupo}`,{})
  }

  habilitarDeshabilitar(idInscripcion : number) : Observable <InscripcionResponseDTO> {
    return this.httpClient.put <InscripcionResponseDTO> (`${this.baseUrl}/desactivar/${idInscripcion}`,{})
  }

  //alumnos por grupo
  obtenerAlumnosPorGrupo(idGrupo: number): Observable<alumnoGrupoDTOResponse[]>{
    return this.httpClient.get<alumnoGrupoDTOResponse[]>(`${this.baseUrl}/grupo/${idGrupo}/alumnos`);
  }
}
