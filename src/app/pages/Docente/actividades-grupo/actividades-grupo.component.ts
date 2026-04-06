import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ActividadGrupoService } from '../../../services/actividad-grupo.service';
import { actividadGrupoDTOResponse } from '../../../models/dto/ResponseDto/actividadGrupoDTOResponse';
import { CampoAgrupadoDTO } from '../../../models/dto/ResponseDto/campoAgrupadoDTO';
import { CommonModule } from '@angular/common';
import { NgbAccordionCollapse } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-actividades-grupo',
  standalone: true,
  imports: [CommonModule, NgbAccordionCollapse],
  templateUrl: './actividades-grupo.component.html',
  styleUrl: './actividades-grupo.component.scss'
})
export class ActividadesGrupoComponent implements OnInit {
  idGrupo : number = 0;

  actividades : actividadGrupoDTOResponse[] = [];
  gruposCampos: CampoAgrupadoDTO[] = [];
  gruposCamposFiltrados : CampoAgrupadoDTO[] = [];

  constructor(
    private route : ActivatedRoute, 
    private actividadesGrupoService : ActividadGrupoService,
    private router : Router
    
  ){}
  ngOnInit(): void {
      this.idGrupo =  Number(this.route.parent?.snapshot.paramMap.get('idGrupo'));
      this.cargarActividadesGrupo();
  }

  cargarActividadesGrupo(){
    this.actividadesGrupoService.obtenerActividadesGrupales(this.idGrupo).subscribe({
      next : (data) => {
        this.actividades = data;
         this.gruposCampos = this.agruparPorCampo(this.actividades);
         this.gruposCamposFiltrados = this.gruposCampos; 
      }
    });
  }

  agruparPorCampo(actividades: actividadGrupoDTOResponse[]) : CampoAgrupadoDTO[] {
  const grupoCampos: {[campo : string] : actividadGrupoDTOResponse[]} = {};

  actividades.forEach(act => {
    const campo = act.campo || 'Sin campo';
    if (!grupoCampos[campo]) {
      grupoCampos[campo] = [];
    }
    grupoCampos[campo].push(act);
  });

  return Object.keys(grupoCampos).map(nombreCampo => ({
    nombre: nombreCampo,
    actividades: grupoCampos[nombreCampo]
  }));
}

verActividad(act: actividadGrupoDTOResponse) {
  this.router.navigate(['../actividad', act.idActividadGrupo], {
    relativeTo: this.route
  });
}

}
