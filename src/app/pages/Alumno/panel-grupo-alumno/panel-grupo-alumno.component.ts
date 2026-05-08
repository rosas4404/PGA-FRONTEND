import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { InscripcionResponseDTO } from '../../../models/dto/ResponseDto/inscripcionResponseDTO';
import { InscripcionService } from '../../../services/inscripcion.service';

@Component({
  selector: 'app-panel-grupo-alumno',
  standalone: true,
  imports: [RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './panel-grupo-alumno.component.html',
  styleUrl: './panel-grupo-alumno.component.scss'
})
export class PanelGrupoAlumnoComponent implements OnInit{
  nombreGrupo: string | null | undefined;
  idUsuario! : number;
  idInscripcion! : number;
  inscripcion!: InscripcionResponseDTO;
  mensajeError = '';

  constructor(private route : ActivatedRoute,private inscripcionService: InscripcionService){}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
      this.idUsuario = user.id;
          
      this.inscripcionService.consultaGrupoAlumno(this.idUsuario).subscribe({
        next: (resp) => {
          this.idInscripcion = resp.idInscripcion;
        }, error: (err) => {
            if (err.status === 409) {
              this.mensajeError =
              err.error?.message || 'El alumno no cuenta con inscripciones activas';
            } else {
              this.mensajeError ='Ocurrió un error al consultar las sesiones';
            }
          }
    });
    this.nombreGrupo = this.route.snapshot.paramMap.get('nombre');
  }



}
