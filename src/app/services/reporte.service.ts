import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private apiUrl: string = `${baseUrl}/reporte`;
  constructor(private httpClient : HttpClient) { }


generarReporteAlumno (idUsuario : number) : Observable <Blob>{
  return this.httpClient.get(`${this.apiUrl}/alumnos/${idUsuario}/reporte`,{ responseType: 'blob' });
  }
}