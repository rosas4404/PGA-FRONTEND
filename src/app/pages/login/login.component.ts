import { Component } from '@angular/core';
import { loginDTO } from '../../models/dto/loginDTO';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginData: loginDTO = {
    username:'',
    password:''
  }

  constructor( private loginService: LoginService, private router: Router){}

    login() {

    if (!this.loginData.username || !this.loginData.password) {
      return;
    }

    this.loginService.login(this.loginData).subscribe({
      next: (data: any) => {

        const token = data.token;

        // Guardamos token
        this.loginService.loginUser(token);

        // Decodificamos token
        const decoded: any = jwtDecode(token);

        console.log("TOKEN DECODIFICADO:", decoded);

        // Validamos cambio obligatorio
        if (decoded.debeCambiarPassword) {
          this.router.navigate(['password']);
          return; 
        }

        // Si no debe cambiar password, ahora pedimos usuario
        this.loginService.getCurrentUser().subscribe(
          (user: any) => {

            this.loginService.setUser(user);

            const role = user.authorities[0].authority;

            if (role.includes("ROLE_ADMIN")) {
              this.router.navigate(['admin-dashboard']);
            } else if (role.includes("ROLE_DOCENTE")) {
              this.router.navigate(['docente-dashboard']);
            } else if (role.includes("ROLE_ALUMNO")) {
              this.router.navigate(['alumno-dashboard']);
            } else {
              this.router.navigate(['home']);
            }
          }
        );
      },
      error: () => {
        this.resetFormulario();
      }
    });
  }

  resetFormulario():void{
    this.loginData = {username:'', password:''};
  }
}
