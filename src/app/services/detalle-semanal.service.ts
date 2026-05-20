import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalleSeguimientoAgrupadoDto } from '../models/dto/RequestDto/DetalleSeguimientoAgrupadoDto';
import { Observable } from 'rxjs';
import { DetalleDashboardDto } from '../models/dto/ResponseDto/DetalleDashboardDto';
import { DetalleSeguimientoRequestDto } from '../models/dto/RequestDto/DetalleSeguimientoRequestDto';

@Injectable({
  providedIn: 'root'
})
export class DetalleSemanalService {
  private apiUrl: string = 'http://localhost:8080/api/detalles';
  private httpHeaders = new HttpHeaders({'Content-Type' : 'application/json'});

  constructor(private httpClient : HttpClient) { }

  crearDetalle(dto: DetalleSeguimientoAgrupadoDto) : Observable <DetalleDashboardDto[]> {
    return this.httpClient.post<DetalleDashboardDto[]>(this.apiUrl, dto)
  }

  actualizarDetalle(idDetalle: number, dto: DetalleSeguimientoRequestDto) : Observable <DetalleDashboardDto>{
    return this.httpClient.put<DetalleDashboardDto> (`${this.apiUrl}/${idDetalle}`, dto)
  }
}
