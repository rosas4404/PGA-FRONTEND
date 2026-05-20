import { Component, OnInit } from '@angular/core';
import { SeguimientoDashboardResponseDto } from '../../../models/dto/ResponseDto/SeguimientoDashboardResponseDto';
import { SeguimientoSemanalService } from '../../../services/seguimiento-semanal.service';
import { InscripcionService } from '../../../services/inscripcion.service';
import { CommonModule, DatePipe, KeyValuePipe } from '@angular/common';
import { GrupoMes } from '../../../models/dto/ResponseDto/GrupoMes';

@Component({
  selector: 'app-seguimiento-semanal',
  standalone: true,
  imports: [DatePipe,KeyValuePipe, CommonModule],
  templateUrl: './seguimiento-semanal.component.html',
  styleUrl: './seguimiento-semanal.component.scss'
})
export class SeguimientoSemanalComponent implements OnInit{
  idUsuario = 0;
  idInscripcion = 0;
  seguimientos : SeguimientoDashboardResponseDto[] = [];
  semanasAgrupadas: GrupoMes[] = [];
  mesActivo = 0;
  constructor( 
    private seguimientoService : SeguimientoSemanalService,
    private inscripcionService : InscripcionService
  ){}

  ngOnInit(): void {
   const user = JSON.parse(localStorage.getItem('user')!);
      this.idUsuario = user.id;
      this.cargarInscripcion(this.idUsuario);

  }
   cargarInscripcion(id: number) {
    this.inscripcionService.consultaGrupoAlumno(id).subscribe(
      data => {
        this.idInscripcion= data.idInscripcion;
        this.cargarSeguimientos();
      }
    );
  }
  cargarSeguimientos() {
    this.seguimientoService.obtenerHistorialAlumno(this.idInscripcion).subscribe({
      next: data => {
        this.seguimientos = data;
        this.agruparPorMes();
      }
    });
  }
 agruparPorMes(): void {

  const grupos: Record<
    string,
    SeguimientoDashboardResponseDto[]
  > = {};

  this.seguimientos.forEach(semana => {

    const [dia, mes, anio] =
      semana.semanaInicio.split('/');

    const fecha = new Date(
      Number(anio),
      Number(mes) - 1,
      Number(dia)
    );

    const nombreMes =
      fecha.toLocaleString('es-MX', {
        month: 'long',
        year: 'numeric'
      });

    if (!grupos[nombreMes]) {
      grupos[nombreMes] = [];
    }

    grupos[nombreMes].push(semana);

  });

  this.semanasAgrupadas =
    Object.entries(grupos).map(
      ([mes, semanas]) => ({
        mes,
        semanas
      })
    );
}
  
}

