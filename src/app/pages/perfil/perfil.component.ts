import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { usuarioDTOResponse } from '../../models/dto/ResponseDto/usuarioDTOResponse';
import { UsuarioService } from '../../services/usuario.service';
import { ActivatedRoute, Router, TitleStrategy } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { usuarioDTORequest } from '../../models/dto/RequestDto/usuarioDTORequest';
import { CambioPasswordService } from '../../services/cambio-password.service';
import { cambioContraseñaDTO } from '../../models/dto/cambioContraseñaDTO';
import { LoginService } from '../../services/login.service';



@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit{

  

  usuario!: usuarioDTOResponse;
  usuarioForm!: FormGroup;
  passwordForm!: FormGroup;

  idUsuario!:number;

  confirmarNuevaPassword:string ='';

  modo: 'perfil' | 'editar' | 'password' = 'perfil';

  showActual =false;
  showNueva=false;
  showConfirmar=false;

  get rolUsuario():string{
    const user = JSON.parse(localStorage.getItem('user')!);
    const rol = user.authorities[0].authority;
    if(rol.includes('ADMIN')) return 'Administrador';
    if(rol.includes('DOCENTE')) return 'Docente';
    if(rol.includes('ALUMNO')) return 'Alumno';
    return 'Usuario';
  }

  constructor(private usuarioService: UsuarioService, private loginService:LoginService , private cambioPasswordService: CambioPasswordService, private fb:FormBuilder, private toastr:ToastrService, private modalService:NgbModal, private route:ActivatedRoute, private router: Router){}
  
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.idUsuario = user.id;
    this.verDatos();

    this.usuarioForm=this.fb.group({
      nombre:[''],
      apellidoPaterno:[''],
      apellidoMaterno:['', Validators.required],
      telefono: ['',[Validators.required, Validators.minLength(10), Validators.maxLength(10),Validators.pattern("[0-9]*")]],
      direccion:['', Validators.required]
    })

    this.passwordForm=this.fb.group({
      actualPassword:['', Validators.required],
      nuevaPassword:['', Validators.required],
      confirmarNuevaPassword:['', Validators.required]
    })

  }
  

  verDatos(){
    this.usuarioService.obtenerUsuarioId(this.idUsuario).subscribe({
      next: (data) => {
        this.usuario=data;
      }
    })
  }

  actualizar(){
    if(this.usuarioForm.invalid)return;

    const formValue: usuarioDTORequest= this.usuarioForm.value;
    this.usuarioService.actualizarDatos(this.idUsuario, formValue).subscribe({
      next:()=>{
        this.toastr.success('Actualizado', 'Datos actualizdos correctamente')
        this.verDatos();
        this.modo='perfil';
      }, error:(err)=>{
        this.toastr.error(err.error.message||'Error');
      }
    });
  }

  cambioPassword(){
    if(this.passwordForm.invalid || !this.equalPassword()) return;
  
    const passwordData : cambioContraseñaDTO=this.passwordForm.value;

    this.cambioPasswordService.cambioContraseña(passwordData).subscribe({
      next:(data:any)=>{
        this.toastr.success('Contraseña actualizada correctamente', 'Éxito')
        this.loginService.logout();
        this.router.navigate(["/login"]);
      },
      error:(err:any)=>{
        this. toastr.error('Ocurrió un error al actualizar contraseña <br>' + err.error.message, 'Error',  { enableHtml: true })
      },
    
    })

    }
  

  equalPassword():boolean{
    return this.passwordForm.get('nuevaPassword')?.value === this.passwordForm.get('confirmarNuevaPassword')?.value;
  }

  cancelarEdicion(){
    this.modo='perfil';
    this.usuarioForm.reset();
  }

  cancelar(){
    this.modo='perfil';
    this.passwordForm.reset();
  }

  editar(){
    this.modo='editar';
    //cargamos los datos actuales
    this.usuarioForm.patchValue({
      nombre : this.usuario.nombre,
      apellidoPaterno : this.usuario.apellidoPaterno,
      apellidoMaterno : this.usuario.apellidoMaterno,
      telefono : this.usuario.telefono,
      direccion: this.usuario.direccion
    });
  }

  editarContra(){
    this.modo='password';
    this.passwordForm.reset();
  }

  
}
