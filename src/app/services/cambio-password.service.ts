import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cambioContraseñaDTO } from '../models/cambioContraseñaDTO';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CambioPasswordService {

  constructor(private httpClient: HttpClient, ) {   
  }
  public cambioContraseña (passwordData:cambioContraseñaDTO){
    return this.httpClient.put("http://localhost:8080/api/auth/cambiar-password", passwordData);
  }

}

