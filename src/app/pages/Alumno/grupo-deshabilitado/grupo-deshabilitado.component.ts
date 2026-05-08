import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet, Router} from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grupo-deshabilitado',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './grupo-deshabilitado.component.html',
  styleUrl: './grupo-deshabilitado.component.scss'
})
export class GrupoDeshabilitadoComponent implements OnInit{

  nombreGrupo: string | null | undefined;
  idInscripcion: string | null = null;

  constructor(
    private route : ActivatedRoute, private router: Router,
  ){
  }
  ngOnInit(): void {
    this.nombreGrupo = this.route.snapshot.paramMap.get('nombre');

    this.route.firstChild?.params.subscribe(params => {
      this.idInscripcion = params['idInscripcion'] || null;
    });
    
  }

  volver(){
  this.router.navigate(['alumno-dashboard/inicio-grupos-desh']); //navegacion relativa para entrar al hijo
  }

}
