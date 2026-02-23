import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl: string = 'http://localhost:8080/api/auth';
  private httpHeaders = new HttpHeaders({'Content-Type' : 'application/json'});
  //inyectando la dependencia en el constructor, es equivalente a que http fuese un atributo de la clase
  constructor(private http:HttpClient) { }

  //enviar usuario y contraseña
  login (loginData:any): Observable<any>{
    return this.http.post(`${this.apiUrl}/login`, loginData);
  }

  //iniciamos sesión y establecemos el token en el local Storage
  loginUser(token:any){
    localStorage.setItem('token', token);
  }

  //verificar si esta o no conectado
  isLoggedIn(){
    let tokenStr = localStorage.getItem('token');
    if(tokenStr == undefined || tokenStr=='' || tokenStr==null){
      return false;
    }else{
      return true;
    }
  }

  //cerramos sesion y eliminamos el token del local storage
  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return true;
  }

  //obtenemos el token
  getToken(){
    return localStorage.getItem('token');
  }

  //establecemos el user
  setUser(user:any){
    localStorage.setItem('user', JSON.stringify(user));
  }

  //obtenemos el user
  getUser(){
    let userStr= localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  //devolvemos las autoridades
  getUserRole(){
    let user = this.getUser();
    return user.authorities[0].authority;
  }
  //obtener claim para cambio de contraseña forzoso
  getDebeCambiarContraseña(){
    let user = this.getUser();
    return user.debeCambiarContraseña;
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario-actual`);
  }

  //obtenemos id por token
  getIdUsuario(): number{
    const token = this.getToken();
      if (!token) return 0;
      const decoded: any = jwtDecode(token);
      console.log(decoded);
      return decoded.idUsuario;
  }
}
