import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { documentoExpedienteDTOResponse } from '../models/dto/ResponseDto/documentoExpedienteDTOResponse';
import { docuemntoRevisionDTORequest } from '../models/dto/RequestDto/documentoRevisonDTORequest';

@Injectable({
  providedIn: 'root'
})
export class DocumentoExpedienteService {

  private apiUrl: string = 'http://localhost:8080/api/expedientes';
  private httpHeaders = new HttpHeaders ({'Content-Type' : 'application/json'});

  //inyectamos la dependencia en el constructor, es equivalente a que el http sea un atributo en la clase
  constructor(private http:HttpClient) { }

  //subir documento
  subirDocumento(idAlumno:number, tipo:String, archivo:File): Observable<documentoExpedienteDTOResponse>{
    const formData = new FormData();//envia archivos al back usando multipart/form-data
    formData.append('archivo',archivo);//agrega el archivo al formdata
    return this.http.post<documentoExpedienteDTOResponse>(`${this.apiUrl}/${idAlumno}/documentos/${tipo}`, formData);
  }
  
  //visualizar documentos
  visualizarDocumento(idDocumento: number):Observable<Blob>{//NOTA: el blob es un tipo de dato que representa archivos binarios o datos crudos inmutables de tamaño arbitrario (imagenes videos, etc)
    return this.http.get(`${this.apiUrl}/documentos/${idDocumento}/ver`, {responseType:'blob'});
  }

  //revisar documentos
  revisarDocumentos(idDocumento:number, dto:docuemntoRevisionDTORequest): Observable<void>{
    return this.http.put<void>(`${this.apiUrl}/documentos/${idDocumento}/revision`, dto);
  }
}
