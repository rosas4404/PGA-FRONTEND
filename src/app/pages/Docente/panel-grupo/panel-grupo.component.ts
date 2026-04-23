import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-panel-grupo',
  standalone: true,
  imports: [RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './panel-grupo.component.html',
  styleUrl: './panel-grupo.component.scss'
})
export class PanelGrupoComponent implements OnInit{
nombreGrupo: string | null | undefined ;

constructor(
  private route : ActivatedRoute,
){
}
ngOnInit(): void {
  this.nombreGrupo = this.route.snapshot.paramMap.get('nombre');
}
}
