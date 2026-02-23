import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { LoginService } from "../login.service";

@Injectable({
    providedIn:'root'
})
export class docenteAlumnoGuard implements CanActivate{
    constructor(private loginService: LoginService, private router: Router){}

    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): boolean | UrlTree {
        
            if (this.loginService.isLoggedIn() && (this.loginService.getUserRole().includes("ROLE_ALUMNO")||this.loginService.getUserRole().includes("ROLE_DOCENTE"))){
                return true;
            }

            this.router.navigate(['login']);
            return false;
    }
}