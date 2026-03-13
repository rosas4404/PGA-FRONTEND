import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { actividadBaseDTOResponse } from '../models/dto/ResponseDto/actividadBaseDTOResponse';

@Injectable({
  providedIn: 'root'
})
export class ActividadBaseService {
  private apiUrl: string = 'http://localhost:8080/api/actividadBase';
  private httpHeaders = new HttpHeaders({'Content-Type' : 'application/json'});
  
  //inyectamos la dependencia en el constructor, es equivalente a que el http sea un atributo en la clase
  constructor(private http:HttpClient) { }
  
  //consulta de actividades base activas
  getActividadesBaseActivas(): Observable<actividadBaseDTOResponse[]>{
      return this.http.get<actividadBaseDTOResponse[]>(`${this.apiUrl}/activas`);
    }
  
}
