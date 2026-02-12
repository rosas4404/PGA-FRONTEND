import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TitleStrategy } from '@angular/router';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-usuario.component.html',
  styleUrl: './registro-usuario.component.scss'
})
export class RegistroUsuarioComponent implements OnInit {
    registroForm!: FormGroup;

    constructor(private fb: FormBuilder){}

    ngOnInit(): void {
      this.registroForm = this.fb.group({
        tipo:['', Validators.required],
        //datos generales
          nombre: ['',Validators.required],
          apellidoPaterno: ['',Validators.required],
          apellidoMaterno: ['',Validators.required],
          direccion: ['',Validators.required],
          email: ['',[Validators.required, Validators.email]],
          telefono: ['',[Validators.required, Validators.minLength(10), Validators.maxLength(10),Validators.pattern("[0-9]*")]],
       
       //datos del alumno
        universidad:[''],
        carrera: [''],
        fechaTermino:[''],

        //contraseña
        password: ['', [Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)]],
          confirmPassword: ['', Validators.required]}, { validators: this.passwordsMatchValidator });

      this.escucharTipo();

      
    }

    passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;

      if (!password || !confirmPassword) {
        return null;
      }

       return password === confirmPassword
        ? null
        : { passwordMismatch: true };
    }

  
    escucharTipo(): void {
      this.registroForm.get('tipo')?.valueChanges.subscribe(tipo => {

        const universidad = this.registroForm.get('universidad');
        const carrera = this.registroForm.get('carrera');
        const fecha = this.registroForm.get('fechaTermino');

        if (tipo === 'ALUMNO') {
          universidad?.setValidators(Validators.required);
          carrera?.setValidators(Validators.required);
          fecha?.setValidators;
        } else {
          universidad?.clearValidators();
          carrera?.clearValidators();
          fecha?.clearValidators();

          universidad?.reset();
          carrera?.reset();
          fecha?.reset();
        }

        universidad?.updateValueAndValidity();
        carrera?.updateValueAndValidity();
        fecha?.updateValueAndValidity();
      });
    }

    submit() {
      if (this.registroForm.invalid) {
        this.registroForm.markAllAsTouched();
        return;
      }

      const formValue = { ...this.registroForm.value };

      // mandar null si es docente
      if (formValue.tipo !== 'ALUMNO') {
        formValue.universidad = null;
        formValue.carrera = null;
        formValue.fechaTermino = null;
      }

      //si fecha viene vacia
      if(!formValue.fechaTermino){
        formValue.fechaTermino = null;
      }

      // poner formato defecha dd/MM/yyyy
      if (formValue.fechaTermino) {
        const fecha = new Date(formValue.fechaTermino);

        formValue.fechaTermino =
          `${fecha.getDate().toString().padStart(2, '0')}/` +
          `${(fecha.getMonth() + 1).toString().padStart(2, '0')}/` +
          `${fecha.getFullYear()}`;
      }

      // Mayúsculas
      formValue.nombre = formValue.nombre?.toUpperCase();
      formValue.apellidoPaterno = formValue.apellidoPaterno?.toUpperCase();
      formValue.apellidoMaterno = formValue.apellidoMaterno?.toUpperCase();
      formValue.direccion = formValue.direccion?.toUpperCase();

      if (formValue.universidad)
        formValue.universidad = formValue.universidad.toUpperCase();

      if (formValue.carrera)
        formValue.carrera = formValue.carrera.toUpperCase();

      console.log(formValue);
    }

}
