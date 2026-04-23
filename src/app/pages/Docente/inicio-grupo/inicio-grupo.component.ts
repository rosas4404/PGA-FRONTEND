import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GrupoService } from '../../../services/grupo.service';
import { grupoDTOResponse } from '../../../models/dto/ResponseDto/grupoDTOResponse';
import { CommonModule } from '@angular/common';
import baseUrl from '../../../services/helper';
import { ReporteService } from '../../../services/reporte.service';

@Component({
  selector: 'app-inicio-grupo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio-grupo.component.html',
  styleUrl: './inicio-grupo.component.scss'
})
export class InicioGrupoComponent implements OnInit {
  idGrupo: number = 0;
  grupo!: grupoDTOResponse;
  constructor(
    private route : ActivatedRoute,
    private grupoService : GrupoService, private router : Router,
    private reporteService : ReporteService){}

  ngOnInit(): void {
    this.idGrupo = Number (this.route.parent?.snapshot.paramMap.get('idGrupo'));
    this.cargarGrupo();
  }
  cargarGrupo(){
    this.grupoService.getGrupo(this.idGrupo).subscribe({
      next: (data) =>{
        this.grupo = data;
      } 
    })
  }


  descargarReporte(id: number | undefined) {
    if (!id) return;
    
      this.reporteService.generarReporteAsistencia(id).subscribe((blob: Blob) => {
      // Creamos un link temporal en el DOM
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      a.download = `reporte_asistencia_grupo_${id}.pdf`; 
      
      document.body.appendChild(a);
      a.click();
      
      // Limpieza
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      console.error("Error al descargar el PDF", error);
    });
  }

  descargarReporteSeguimiento(id: number | undefined) {
    if (!id) return;
    
      this.reporteService.generarReporteSeguimiento(id).subscribe((blob: Blob) => {
      // Creamos un link temporal en el DOM
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      a.download = `reporte_seguimiento_grupo_${id}.pdf`; 
      
      document.body.appendChild(a);
      a.click();
      
      // Limpieza
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      console.error("Error al descargar el PDF", error);
    });
  }
  
}
