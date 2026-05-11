import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbAccordionCollapse } from '@ng-bootstrap/ng-bootstrap';
import { actividadAlumnoListaDTO } from '../../../models/dto/ResponseDto/actividadAlumnoListaDTO';
import { ActivatedRoute, Router } from '@angular/router';
import { ActividadAlumnoService } from '../../../services/actividad-alumno.service';
import { InscripcionService } from '../../../services/inscripcion.service';
import { CampoAgrupadoAlumnoDTO } from '../../../models/dto/ResponseDto/camposAgrupadosAlumnoDTO';

@Component({
  selector: 'app-actividades-alumno',
  standalone: true,
  imports: [CommonModule, NgbAccordionCollapse,],
  templateUrl: './actividades-alumno.component.html',
  styleUrl: './actividades-alumno.component.scss'
})
export class ActividadesAlumnoComponent implements OnInit{
  idGrupo = 0;
  idUsuario!: number;
  idInscripcion!: number;

  actividades : actividadAlumnoListaDTO [] = [];
  alumnoCampos : CampoAgrupadoAlumnoDTO [] = [];
  alumnoCamposFiltrados : CampoAgrupadoAlumnoDTO[] = [] ;

  constructor(private route : ActivatedRoute, private router : Router, private actividadAlumnoService : ActividadAlumnoService, private inscripcionService : InscripcionService){}

  ngOnInit(): void {
      const user = JSON.parse(localStorage.getItem('user')!);
      this.idUsuario = user.id;

      this.inscripcionService.consultaGrupoAlumno(this.idUsuario).subscribe({
        next: (resp) => {
          this.idInscripcion = resp.idInscripcion;
          this.cargarActividades();
        }
      });
  }


  cargarActividades(){
    this.actividadAlumnoService.obtenerActividadesPorInscripcion(this.idInscripcion).subscribe({
      next: (data) => {
        this.actividades = data;
        this.alumnoCampos = this.agruparPorCampo(this.actividades);
        this.alumnoCamposFiltrados = this.alumnoCampos;
      }
    })
  }

  agruparPorCampo(actividades: actividadAlumnoListaDTO[]) : CampoAgrupadoAlumnoDTO[] {
    const alumnoCampos: {[campo : string] : actividadAlumnoListaDTO[]} = {};
  
    actividades.forEach(act => {
      const campo = act.campoFormativo || 'Sin campo';
      if (!alumnoCampos[campo]) {
        alumnoCampos[campo] = [];
      }
      alumnoCampos[campo].push(act);
    });
  
    return Object.keys(alumnoCampos).map(nombreCampo => ({
      nombre: nombreCampo,
      actividades: alumnoCampos[nombreCampo]
    }));
  }

  verActividad(idActividadAlumno: number, idInscripcion: number) {
    this.router.navigate([ idActividadAlumno, idInscripcion], {
      relativeTo: this.route
    });
  }

}
