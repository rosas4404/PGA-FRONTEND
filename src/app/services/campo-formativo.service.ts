import { Injectable } from '@angular/core';
import baseUrl from './helper';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PageResponse } from '../models/pageResponse';
import { Observable } from 'rxjs';
import { campoDTOResponse } from '../models/dto/ResponseDto/campoDTOResponse';
import { campoDTORequest } from '../models/dto/RequestDto/campoDTORequest';


@Injectable({
  providedIn: 'root'
})
export class CampoFormativoService {
private baseUrl =`${baseUrl}/campo`;
  private httpHeaders= new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private httpClient: HttpClient) {}

  
    obtenerCampos(page: number, size: number, filtros:any) : Observable <PageResponse<campoDTOResponse>>{
      let params= new HttpParams()
      .set ('page', page.toString())
      .set('size', size.toString());
  
      if(filtros.activo !== null && filtros.activo != undefined){
        params = params.set('activo', filtros.activo.toString());
      }
      if(filtros.nombre !== null && filtros.nombre != undefined){
        params = params.set('nombre', filtros.nombre.toString())
      }
  
      return this.httpClient.get<PageResponse<campoDTOResponse>>(this.baseUrl, { params });
    }


    crearCampo (campo : campoDTORequest): Observable <campoDTOResponse>{
        return this.httpClient.post<campoDTOResponse>(this.baseUrl,campo);
    }

    desactivarActivar(idCampo : number): Observable <campoDTOResponse>{
      return this.httpClient.put<campoDTOResponse>(`${this.baseUrl}/habilitarDeshabilitar/${idCampo}`,{})
    }

    actualizar(campo : campoDTORequest, idCampo: number) : Observable <campoDTOResponse>{
      return this.httpClient.put<campoDTOResponse> (`${this.baseUrl}/${idCampo}`,campo)
    }

    obtenerCamposActivos () : Observable < campoDTOResponse [] > {
      return this.httpClient.get< campoDTOResponse [] > (`${this.baseUrl}/activos`,{})
    }
}



