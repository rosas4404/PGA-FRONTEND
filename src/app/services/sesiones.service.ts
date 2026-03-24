import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';
import { Observable } from 'rxjs';
import { sesionDocenteDTOResponse } from '../models/dto/ResponseDto/sesionDocenteDTOResponse';

@Injectable({
  providedIn: 'root'
})
export class SesionesService {

  private apiUrl: string = `${baseUrl}/sesiones`;
  constructor(private httpClient : HttpClient) { }


  obtenerSesionesDocente(idDocente : number)  : Observable <sesionDocenteDTOResponse[]> {
    return this.httpClient.get<sesionDocenteDTOResponse[]>(`${this.apiUrl}/porDocente/${idDocente}`);
  }

  
}
