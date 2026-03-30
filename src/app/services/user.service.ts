import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { usuarioDTO } from '../models/dto/usuarioDTO';
import { Form, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient:HttpClient) { }
  
  public register(form:FormGroup ){
    return this.httpClient.post('http://localhost:8080/api/auth/register', form);
  }
}
