import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { actividadGrupoDTOResponse } from '../models/dto/ResponseDto/actividadGrupoDTOResponse';
import { actividadGrupoDashboardDTO } from '../models/dto/ResponseDto/actividadGrupoDashboardDTO';
import { AgregarInscripcionesRequestDTO } from '../models/dto/RequestDto/agregarInscripcionesRequestDTO';
import { asignarActividadExtraDto } from '../models/dto/RequestDto/asignarActividadExtraDto';
import { AsignarActividadCatalogoDto } from '../models/dto/RequestDto/asignarActividadCatalogoDto';
import { grupoResumenDTOResponse } from '../models/dto/ResponseDto/grupoResumenDTOResponse';
import { AsignarActividadCatalogoMultipleDto } from '../models/dto/RequestDto/asignarActividadCatalogoMultipleDto';
import { asignarActividadExtraMultipleDto } from '../models/dto/RequestDto/asignarActividadExtraMultipleDto';
import { actividadGrupoAgrupadaDTOResponse } from '../models/dto/ResponseDto/actividadGrupoAgrupadaDTOResponse';


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


  obtenerActividadPorId(idActividad : number) : Observable <actividadGrupoDashboardDTO>{
    return this.httpClient.get<actividadGrupoDashboardDTO> (`${this.apiUrl}/actividad/${idActividad}`)

  }


  agregarInscripciones (idActividad : number, dto :AgregarInscripcionesRequestDTO) : Observable <actividadGrupoDTOResponse>{
    return this.httpClient.post<actividadGrupoDTOResponse>(`${this.apiUrl}/actividad-grupo/${idActividad}/inscripciones`, dto)
  }

  actualizarInstrucciones(idActividad : number, archivo : File| null) : Observable<actividadGrupoDTOResponse>{
    const formData = new FormData();
    if (archivo) {
      formData.append('archivo', archivo);
    }
    return this.httpClient.put<actividadGrupoDTOResponse>(`${this.apiUrl}/actividad/${idActividad}/actualizar`, formData);
  }


  agregarDesdeCatalogo(idGrupo: number, dto : AsignarActividadCatalogoDto, archivo: File| null) : Observable <actividadGrupoDTOResponse>{
    const formData = new FormData();
    formData.append ('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
    if (archivo) {
      formData.append('archivo', archivo);
    }
    return this.httpClient.post<actividadGrupoDTOResponse>(`${this.apiUrl}/${idGrupo}/actividades/catalogo`, formData);
  }
  agregarextra(idGrupo: number, dto : asignarActividadExtraDto, archivo: File| null) : Observable <actividadGrupoDTOResponse>{
    const formData = new FormData();
    formData.append ('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
    if (archivo) {
      formData.append('archivo', archivo);
    }
    return this.httpClient.post<actividadGrupoDTOResponse>(`${this.apiUrl}/${idGrupo}/actividades/extra`, formData);
  }

  obtenerGruposSinActividad(titulo: string, idDocente: number) : Observable <grupoResumenDTOResponse[]>{
    return this.httpClient.get<grupoResumenDTOResponse[]>(`${this.apiUrl}/${idDocente}/actividad`, { params: { titulo } })
  }

  agregarDesdeCatalogoMultipleGrupos(dto : AsignarActividadCatalogoMultipleDto, archivo: File| null) : Observable <void>{
    const formData = new FormData();
    formData.append ('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
    if (archivo) {
      formData.append('archivo', archivo);
    }
    return this.httpClient.post<void>(`${this.apiUrl}/actividades/catalogo/multiples`, formData);
  }

  agregarExtraMultipleGrupos(dto : asignarActividadExtraMultipleDto, archivo: File| null) : Observable <void>{
    const formData = new FormData();
    formData.append ('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
    if (archivo) {
      formData.append('archivo', archivo);
    }
    return this.httpClient.post<void>(`${this.apiUrl}/actividades/extra/multiples`, formData);
  }
  
  cargarActividadesGruposDocente(idDocente: number) : Observable <actividadGrupoAgrupadaDTOResponse[]>{
    return this.httpClient.get<actividadGrupoAgrupadaDTOResponse[]>(`${this.apiUrl}/docente/${idDocente}/actividades`);
  }

  actualizarInstruccionesMultiple(idActividades: number[], archivo: File|null ) : Observable <void>{
    const formData = new FormData();
     formData.append ('idActividades', new Blob([JSON.stringify(idActividades)], { type: 'application/json' }));
    if (archivo) {
      formData.append('archivo', archivo);
    };
    return this.httpClient.put<void>(`${this.apiUrl}/actividades/instrucciones`, formData);
    }
  
}


