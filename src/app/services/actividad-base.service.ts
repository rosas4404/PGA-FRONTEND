import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { actividadBaseDTOResponse } from '../models/dto/ResponseDto/actividadBaseDTOResponse';
import { PageResponse } from '../models/pageResponse';
import { actividadBaseDTORequest } from '../models/dto/RequestDto/actividadBaseDTORequest';


@Injectable({
  providedIn: 'root'
})
export class ActividadBaseService {
  private baseUrl: string = 'http://localhost:8080/api/actividadBase';
  private httpHeaders = new HttpHeaders({'Content-Type' : 'application/json'});
  
  //inyectamos la dependencia en el constructor, es equivalente a que el http sea un atributo en la clase
  constructor(private http:HttpClient) { }
  
  //consulta de actividades base activas
  getActividadesBaseActivas(): Observable<actividadBaseDTOResponse[]>{
      return this.http.get<actividadBaseDTOResponse[]>(`${this.baseUrl}/activas`);
    }
  


  obtenerActividadesBase(page: number, size: number, filtros:any) : Observable <PageResponse<actividadBaseDTOResponse>>{
    let params= new HttpParams()
    .set ('page', page.toString())
    .set('size', size.toString());
      
    if(filtros.activo !== null && filtros.activo != undefined){
      params = params.set('activo', filtros.activo.toString());
    }
    if(filtros.nombre !== null && filtros.nombre != undefined){
      params = params.set('nombre', filtros.nombre.toString())
    }
      if(filtros.idCampo !== null && filtros.idCampo != undefined){
      params = params.set('idCampo', filtros.idCampo.toString())
    }
      
    return this.http.get<PageResponse<actividadBaseDTOResponse>>(this.baseUrl, { params });
    }


    
    desactivarActivar(idCampo : number): Observable <actividadBaseDTOResponse>{
      return this.http.put<actividadBaseDTOResponse>(`${this.baseUrl}/habilitarDeshabilitar/${idCampo}`,{})
    }

    registro (actividad : actividadBaseDTORequest): Observable <actividadBaseDTOResponse>{
      return this.http.post<actividadBaseDTOResponse>(this.baseUrl, actividad)
    }

    actualizar(actividad : actividadBaseDTORequest, idActividad: number) : Observable <actividadBaseDTOResponse>{
          return this.http.put<actividadBaseDTOResponse> (`${this.baseUrl}/${idActividad}`,actividad)

    }
}
