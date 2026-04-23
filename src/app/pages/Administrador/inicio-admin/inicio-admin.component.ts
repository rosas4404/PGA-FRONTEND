import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { usuarioDTOResponse } from '../../../models/dto/ResponseDto/usuarioDTOResponse';
import { UsuarioService } from '../../../services/usuario.service';
import { LoginService } from '../../../services/login.service';
import { Router, RouterLink } from '@angular/router';
import { ReporteService } from '../../../services/reporte.service';

@Component({
  selector: 'app-inicio-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio-admin.component.html',
  styleUrl: './inicio-admin.component.scss'
})
export class InicioAdminComponent implements OnInit{

  saludo: string = '';
  idUsuario : number = 0;
  usuarioActual! : usuarioDTOResponse;
  fechaActual! : Date;

  mesActual!: number;
  anioActual!: number;
  mesBase!: number;
  anioBase!: number;
    diasMes: (Date | null) [] = [];
    diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  hoverDia: Date | null = null;

  constructor(private usuarioService : UsuarioService, private loginService : LoginService, private router : Router, private reporteService : ReporteService){}

  ngOnInit(): void {
    this.fechaActual = new Date();
    this.mesActual = this.fechaActual.getMonth();
    this.anioActual = this.fechaActual.getFullYear();
    this.mesBase = this.mesActual;
    this.anioBase = this.anioActual;
    this.saludo = this.getSaludo();
    this.cargarUsuarioActual();
  }

  cargarUsuarioActual(){
    this.loginService.getCurrentUser().subscribe({
      next : (data) => { 
        this.idUsuario = data.id;
        this.usuarioService.obtenerUsuarioId(this.idUsuario).subscribe({
          next: (data)=>{
            this.usuarioActual = data;
          }
        })
      } 
    });

  }

  getSaludo(): string {
    const hora = new Date().getHours();

    if (hora >= 5 && hora < 12) {
      return 'Buenos días';
    } else if (hora >= 12 && hora < 19) {
      return 'Buenas tardes';
    } else {
      return 'Buenas noches';
    }
  }

  convertirFecha(fechaStr: string): Date {
    const [fecha, hora] = fechaStr.split(' ');
    const [dia, mes, anio] = fecha.split('/');

    return new Date(
      Number(anio),
      Number(mes) - 1, // meses empiezan en 0
      Number(dia),
      Number(hora.split(':')[0]),
      Number(hora.split(':')[1])
    );
  }

  formatearHora(fechaStr: string): string {
    const fecha = this.convertirFecha(fechaStr);
    return fecha.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  descargarReporteUsuarios(){

      this.reporteService.generarReporteUsuarios().subscribe((blob: Blob) => {
      // Creamos un link temporal en el DOM
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      a.download = `reporte_usuarios.pdf`; 
      
      document.body.appendChild(a);
      a.click();
      
      // Limpieza
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      console.error("Error al descargar el PDF", error);
    });
  }

  descargarReporteExpedientes(){

    this.reporteService.generarReporteExpediente().subscribe((blob: Blob) => {
      // Creamos un link temporal en el DOM
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      a.download = `reporte_expedientes.pdf`; 
      
      document.body.appendChild(a);
      a.click();
      
      // Limpieza
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      console.error("Error al descargar el PDF", error);
    });
  }

  irALista(){
    this.router.navigate(['usuarios/alumnos']);
  }
}
