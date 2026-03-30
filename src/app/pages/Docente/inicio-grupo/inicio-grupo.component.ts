import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GrupoService } from '../../../services/grupo.service';
import { grupoDTOResponse } from '../../../models/dto/ResponseDto/grupoDTOResponse';
import { CommonModule } from '@angular/common';

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
    private  grupoService : GrupoService){}

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
}
