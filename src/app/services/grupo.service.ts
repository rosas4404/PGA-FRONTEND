import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { grupoDTOResponse } from '../models/dto/ResponseDto/grupoDTOResponse';
import { grupoDTORequest } from '../models/dto/RequestDto/grupoDTORequest';
import { PageResponse } from '../models/pageResponse';
import { grupoDTODashboardResponse } from '../models/dto/ResponseDto/grupoDTODashboardResponse';


@Injectable({
  providedIn: 'root'
})
export class GrupoService {
  private apiUrl: string = 'http://localhost:8080/api/grupo';
  private httpHeaders = new HttpHeaders({'Content-Type' : 'application/json'});

  //inyectamos la dependencia en el constructor, es equivalente a que el http sea un atributo en la clase
  constructor(private http:HttpClient) { }

  //consulta general de grupos
  getGrupos(): Observable<grupoDTOResponse[]>{
    return this.http.get<grupoDTOResponse[]>(this.apiUrl);
  }

  //registro
  crearGrupo(grupoDTORequest:grupoDTORequest):Observable<grupoDTOResponse>{
    return this.http.post<grupoDTOResponse>(this.apiUrl, grupoDTORequest);
  }

  //consulta por id de grupo
  getGrupo(id:number){
    return this.http.get<grupoDTOResponse>(`${this.apiUrl}/${id}`);
  }

  //desactivar/activar estado del grupo
  habilitarDeshabilitar(id: number):Observable<grupoDTOResponse>{
    return this.http.put<grupoDTOResponse>(`${this.apiUrl}/habilitarDeshabilitar/${id}`, id);
  }

  //actualización del docente en el grupo
  actualizarDocenteGrupo(idGrupo: number, idDocente:number, grupoDTORequest:grupoDTORequest):Observable<grupoDTOResponse>{
    return this.http.put<grupoDTOResponse>(`${this.apiUrl}/${idGrupo}/cambiarDocente/${idDocente}`, grupoDTORequest);
  }

  //obtener grupos por curso
  getPorCurso(id:number): Observable<grupoDTOResponse[]>{
    return this.http.get<grupoDTOResponse[]>(`${this.apiUrl}/porCurso/${id}`);
  }

  //obtener grupos por docente
  getPorDocente(id:number): Observable<grupoDTODashboardResponse[]>{
    return this.http.get<grupoDTODashboardResponse[]>(`${this.apiUrl}/porDocente/${id}`);
  }

  //consulta de cursos activos
    getgruposActivos(){
      return this.http.get<grupoDTOResponse[]>(`${this.apiUrl}/activos`);
    }

  //paginacion
  consultaGeneralPage(page: number,size: number,filtros?: any): Observable<PageResponse<grupoDTOResponse>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (filtros) {
      if (filtros.curso) {
        params = params.set('curso', filtros.curso);
      }
      if (filtros.docente) {
        params = params.set('docente', filtros.docente);
      }
      if (filtros.estado) {
        params = params.set('estado', filtros.estado);
      }
    }

    return this.http.get<PageResponse<grupoDTOResponse>>(`${this.apiUrl}/listPage`,{ params });}
  
}
