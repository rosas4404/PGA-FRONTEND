import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { usuarioDTOResponse } from '../models/dto/ResponseDto/usuarioDTOResponse';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl: string = 'http://localhost:8080/api/usuario';
  private httpHeaders = new HttpHeaders({'Content_Type' : 'aplication/json'});

  //inyectamos la dependencia en el constructor, es equivalente a que el http sea un atributo en la clase

  constructor(private http:HttpClient) { }

  //consulta de docentes activos
  getDocentesActivos(): Observable<usuarioDTOResponse[]>{
    return this.http.get<usuarioDTOResponse[]>(`${this.apiUrl}/docentes-activos`);
  }
}