import { Component, OnInit } from '@angular/core';
import { cambioContraseñaDTO } from '../../models/cambioContraseñaDTO';
import { CambioPasswordService } from '../../services/cambio-password.service';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [  
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss'
})
export class PasswordComponent {
  passwordData: cambioContraseñaDTO = {
    actualPassword:'',
    nuevaPassword:''
  }
  confirmPassword:string ='';

  constructor (private cambioPasswordService: CambioPasswordService, 
    private router: Router, private loginService:LoginService, private toastr:ToastrService){}
  
 
  cambioPassword(){
    if(!this.passwordData.actualPassword || !this.passwordData.nuevaPassword){
      return;
    }
    console.log(this.passwordData);
    this.cambioPasswordService.cambioContraseña(this.passwordData).subscribe({
      next:(data:any)=>{
        this.toastr.success('Contraseña actualizada correctamente', 'Éxito')
        this.loginService.logout();
        this.router.navigate(["/login"]);
      },
      error:(err:any)=>{
        this. toastr.error('Ocurrió un error al actualizar contraseña '+' ' + err.message, 'Error')
        this.loginService.logout();
        this.router.navigate(["/login"]);
      },
    
    })

    }
  

  equalPassword():boolean{
    return this.passwordData.nuevaPassword == this.confirmPassword;
  }
}
