import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { usuarioDTOResponse } from '../models/dto/ResponseDto/usuarioDTOResponse';
import { PageResponse } from '../models/pageResponse';
import baseUrl from './helper';
import { usuarioDTORequest } from '../models/dto/RequestDto/usuarioDTORequest';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  

  private apiUrl: string = `${baseUrl}/usuario`;
  private httpHeaders = new HttpHeaders({'Content_Type' : 'aplication/json'});



  //inyectamos la dependencia en el constructor, es equivalente a que el http sea un atributo en la clase

  constructor(private httpClient:HttpClient) { }

  //consulta de docentes activos
  getDocentesActivos(): Observable<usuarioDTOResponse[]>{
    return this.httpClient.get<usuarioDTOResponse[]>(`${this.apiUrl}/docentes-activos`);
  }

  //consulta por id
  obtenerUsuarioId(idUsuario: number): Observable<usuarioDTOResponse>{
    return this.httpClient.get<usuarioDTOResponse>(`${this.apiUrl}/${idUsuario}`);
  }

  //obtener alumnos
 obtenerAlumnos(page: number, size: number, filtros:any ) : Observable <PageResponse<usuarioDTOResponse>>{
    let params= new HttpParams()
    .set ('page', page.toString())
    .set('size', size.toString())
    .set('role', 'ALUMNO');
 
    if(filtros.estado !== null && filtros.estado != undefined){
      params = params.set('estado', filtros.estado.toString());
    }
    if(filtros.nombre !== null && filtros.nombre != undefined){
      params = params.set('nombre', filtros.nombre.toString())
    }

    return this.httpClient.get<PageResponse<usuarioDTOResponse>>(`${this.apiUrl}`, { params });
  }
  //obtener docentes
  
  obtenerDocentes(page: number, size: number, filtros:any ) : Observable <PageResponse<usuarioDTOResponse>>{
    let params= new HttpParams()
    .set ('page', page.toString())
    .set('size', size.toString())
    .set('role', 'DOCENTE');
 
    if(filtros.estado !== null && filtros.estado != undefined){
      params = params.set('estado', filtros.estado.toString());
    }
    if(filtros.nombre !== null && filtros.nombre != undefined){
      params = params.set('nombre', filtros.nombre.toString())
    }

    return this.httpClient.get<PageResponse<usuarioDTOResponse>>(`${this.apiUrl}`, { params });
  }


  //deshabilitar habilitar un usuario

  desactivarActivarUsuario(idUsuario: number): Observable<usuarioDTOResponse[]>{
    return this.httpClient.put<usuarioDTOResponse[]>(`${this.apiUrl}/desactivar/${idUsuario}`,"");
  }

  //actualizar datos del usuaio 
  actualizarDatos(id: number, usuarioDTORequest:usuarioDTORequest):Observable<usuarioDTOResponse>{
    return this.httpClient.put<usuarioDTOResponse>(`${this.apiUrl}/${id}`, usuarioDTORequest);
  }


  
}