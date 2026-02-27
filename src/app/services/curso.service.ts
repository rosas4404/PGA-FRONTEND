import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cursoDTORequest } from '../models/dto/RequestDto/cursoDTORequest';
import { Observable } from 'rxjs';
import { cursoDTOResponse } from '../models/dto/ResponseDto/cursoDTOResponse';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  private apiUrl: string = 'http://localhost:8080/api/curso';
  private httpHeaders = new HttpHeaders({'Content_Type' : 'aplication/json'});

  //inyectamos la dependencia en el constructor, es equivalente a que el http sea un atributo en la clase
  constructor(private http:HttpClient) { }

  //consulta general de cursos
  getCursos(): Observable<cursoDTOResponse[]>{
    return this.http.get<cursoDTOResponse[]>(this.apiUrl);
  }

  //registro
  crearCurso(cursoDTORequest:cursoDTORequest):Observable<cursoDTOResponse>{
    return this.http.post<cursoDTOResponse>(this.apiUrl, cursoDTORequest);
  }

  //consulta por id de curso
  getcurso(id:number){
    return this.http.get<cursoDTOResponse>(`${this.apiUrl}/${id}`);
  }

  //consulta de cursos activos
  getcursoActivos(){
    return this.http.get<cursoDTOResponse[]>(`${this.apiUrl}/activos`);
  }

  //desactivar/activar estado del curso
  habilitarDeshabilitar(id: number):Observable<cursoDTOResponse>{
    return this.http.put<cursoDTOResponse>(`${this.apiUrl}/habilitarDeshabilitar/${id}`, id);
  }

  //actualización del curso
  actualizarCurso(idCurso: number, cursoDTORequest:cursoDTORequest):Observable<cursoDTOResponse>{
    return this.http.put<cursoDTOResponse>(`${this.apiUrl}/${idCurso}`, cursoDTORequest);
  }

  //PENDIENTE LA ASIGNACION DE ACTIVIDES BASE
}


