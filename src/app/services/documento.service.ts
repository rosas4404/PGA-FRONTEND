import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { documentoDTORequest } from '../models/dto/RequestDto/documentoDTORequest';
import { Observable } from 'rxjs';
import { documentoDTOResponse } from '../models/dto/ResponseDto/documentoDTOResponse';
import { PageResponse } from '../models/pageResponse';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService{

  private apiUrl: string = 'http://localhost:8080/api/documentos';
  private httpHeaders = new HttpHeaders ({'Content_Type' : 'aplication/json'});
  
  //inyectamos la dependencia en el constructor, es equivalente a que el http sea un atributo en la clase
  constructor(private http:HttpClient) { }

  //crear documento
  crearDocumento(documentoDTORequest: documentoDTORequest):Observable<documentoDTOResponse>{
    return this.http.post<documentoDTOResponse>(this.apiUrl, documentoDTORequest);
  }

  //obtener documentos
  obtenerDocumentos(): Observable<documentoDTOResponse[]>{
    return this.http.get<documentoDTOResponse[]>(this.apiUrl);
  }

  //obtener documentos por id
  documentoID(id:number){
    return this.http.get<documentoDTOResponse>(`${this.apiUrl}/${id}`);
  }

  //actualizar documento-datos
  actualizarDocumento(idDocumento: number, documentoDTORequest:documentoDTORequest):Observable<documentoDTOResponse>{
    return this.http.put<documentoDTOResponse>(`${this.apiUrl}/${idDocumento}`, documentoDTORequest);
  }

  //habilitar - desabilitar 
  habilitarDeshabilitar(id: number):Observable<void>{
    return this.http.put<void>(`${this.apiUrl}/habilitarDeshabilitar/${id}`, id);
  }

  //filtro de api criteria y paginacion
  consultaGeneralPage(page: number,size: number,filtros?: any): Observable<PageResponse<documentoDTOResponse>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);
   
      if (filtros) {
         if (filtros.nombre) {
           params = params.set('nombre', filtros.nombre);
         }
         if (filtros.activo !== null && filtros.activo !== undefined) {
           params = params.set('activo', filtros.activo);
         }
       }
   
     return this.http.get<PageResponse<documentoDTOResponse>>(`${this.apiUrl}/listPage`,{ params });
  }
}
