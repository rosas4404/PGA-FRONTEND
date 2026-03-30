import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { actividadGrupoDTOResponse } from '../models/dto/ResponseDto/actividadGrupoDTOResponse';

@Injectable({
  providedIn: 'root'
})
export class ActividadGrupoService {
  private apiUrl: string = 'http://localhost:8080/api/grupo';
  private httpHeaders = new HttpHeaders({'Content-Type' : 'application/json'});

  constructor( private httpClient :  HttpClient) { }

  obtenerActividadesGrupales(idGrupo : number): Observable <actividadGrupoDTOResponse[]>{
     return this.httpClient.get<actividadGrupoDTOResponse[]>(`${this.apiUrl}/${idGrupo}/actividades`)
  }
}
