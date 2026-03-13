import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { expedienteDTOResponse } from '../models/dto/ResponseDto/expedienteDTOResponse';
import { Observable } from 'rxjs';
import { observacionesExpedienteDTORequest } from '../models/dto/RequestDto/observacionesExpedienteDTORequest';

@Injectable({
  providedIn: 'root'
})
export class ExpedienteService {

  private apiUrl: string = 'http://localhost:8080/api/expedientes';
  private httpHeaders = new HttpHeaders({'Content-Type' : 'application/json'});

  //inyectamos la dependencia en el constructor, es equivalente a que el http sea un atributo en la clase
  constructor(private http:HttpClient) { }

  //consulta del expediente de un alumno
  obtenerExpedienteporAlumno(idAlumno:number): Observable<expedienteDTOResponse>{
    return this.http.get<expedienteDTOResponse>(`${this.apiUrl}/alumnos/${idAlumno}`);
  }
  
  //agregar observaciones
  observaciones(idExpediente: number, dto:observacionesExpedienteDTORequest):Observable<expedienteDTOResponse>{
    return this.http.put<expedienteDTOResponse>(`${this.apiUrl}/${idExpediente}/observaciones`, dto);
  }

}
