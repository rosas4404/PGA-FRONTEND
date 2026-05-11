import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SemanaResponseDto } from '../models/dto/ResponseDto/SemanaResponseDto';
import { Observable } from 'rxjs';
import { SeguimientoDashboardResponseDto } from '../models/dto/ResponseDto/SeguimientoDashboardResponseDto';
import { PageResponse } from '../models/pageable/PageResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoSemanalService {
  private apiUrl: string = 'http://localhost:8080/api/seguimiento-semanal'
  constructor(private httpClient : HttpClient) { }

  obtenerSemanaActual(idInscripcion : number): Observable<SeguimientoDashboardResponseDto>{
    return this.httpClient.get<SeguimientoDashboardResponseDto>(`${this.apiUrl}/${idInscripcion}/actual`,);
  }
  obtenerHistorialAlumno(page: number, size: number, idInscripcion: number) : Observable <PageResponse<SeguimientoDashboardResponseDto>>{
    let params= new HttpParams()
        .set ('page', page.toString())
        .set('size', size.toString());
    return this.httpClient.get<PageResponse<SeguimientoDashboardResponseDto>>(`${this.apiUrl}/${idInscripcion}`);
  }

  crearSemana(idInscripcion : number) : Observable <SemanaResponseDto>{
   return this.httpClient.post<SemanaResponseDto>(`${this.apiUrl}/${idInscripcion}`,'');
  }
  
}
