import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginService } from "./login.service";
import { catchError, Observable, throwError } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(private loginService: LoginService, private router:Router){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req;
        const token = this.loginService.getToken();
        if(token !=null){
            authReq = authReq.clone({//aqui agregamos una cabecera (igual que el postman)
                setHeaders : {Authorization: `Bearer ${token}`}
            });
        } 
        //agregamos la escucha de la respuesta del back para que lo saque
        return next.handle(authReq).pipe(
            catchError((error:HttpErrorResponse)=>{
            //si el servidor responde que el token no es valido o expiró
                if(error.status===401){
                    this.loginService.logout();//limpia el token y los datos
                    this.router.navigate(['/**']);//redirige al usuario al login
                }
                return throwError(()=>error);
            })
            
        )
    }
}

export const authInterceptorProviders = [
    {
        provide : HTTP_INTERCEPTORS,
        useClass : AuthInterceptor,
        multi:true
    }
]