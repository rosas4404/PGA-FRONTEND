import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cambioContraseñaDTO } from '../models/cambioContraseñaDTO';

@Injectable({
  providedIn: 'root'
})
export class CambioPasswordService {

  constructor(private httpClient: HttpClient, ) {   
  }
  public cambioPassword(cambioContraseñaDTO: cambioContraseñaDTO){
    
  }
}
