import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TitleStrategy } from '@angular/router';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-usuario.component.html',
  styleUrl: './registro-usuario.component.scss'
})
export class RegistroUsuarioComponent implements OnInit {
    registroForm!: FormGroup;

    constructor(private fb: FormBuilder, private userService:UserService){}

    ngOnInit(): void {
      this.registroForm = this.fb.group({
        rol:['', Validators.required],
        //datos generales
          nombre: ['',Validators.required],
          apellidoPaterno: ['',Validators.required],
          apellidoMaterno: ['',Validators.required],
          direccion: ['',Validators.required],
          email: ['',[Validators.required, Validators.email]],
          telefono: ['',[Validators.required, Validators.minLength(10), Validators.maxLength(10),Validators.pattern("[0-9]*")]],
        }); 
    }
    submit() {
      if (this.registroForm.invalid) {
        this.registroForm.markAllAsTouched();
        return;
      }

      const formValue = { ...this.registroForm.value }

      // Mayúsculas
      formValue.nombre = formValue.nombre?.toUpperCase();
      formValue.apellidoPaterno = formValue.apellidoPaterno?.toUpperCase();
      formValue.apellidoMaterno = formValue.apellidoMaterno?.toUpperCase();
      formValue.direccion = formValue.direccion?.toUpperCase();

    this.userService.register(formValue).subscribe({
        next: (data:any)=>{
        
        },
        error: (err)=>{
          //
        }
      });
      
      console.log(formValue);
    }

}
