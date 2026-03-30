import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { UserService } from '../../../services/user.service';
import { LoginService } from '../../../services/login.service';
import { usuarioDTOResponse } from '../../../models/dto/ResponseDto/usuarioDTOResponse';
import { CommonModule } from '@angular/common';
import { GrupoService } from '../../../services/grupo.service';
import { grupoDTOResponse } from '../../../models/dto/ResponseDto/grupoDTOResponse';
import { grupoDTODashboardResponse } from '../../../models/dto/ResponseDto/grupoDTODashboardResponse';
import { SesionesService } from '../../../services/sesiones.service';
import { sesionDocenteDTOResponse } from '../../../models/dto/ResponseDto/sesionDocenteDTOResponse';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {
  
  saludo: string = '';
  idUsuario : number = 0;
  usuarioActual! : usuarioDTOResponse;
  fechaActual! : Date;
  grupos : grupoDTODashboardResponse [] = [];
  sesiones : sesionDocenteDTOResponse[] = [];

 mesActual!: number;
 anioActual!: number;
 mesBase!: number;
 anioBase!: number;
  diasMes: (Date | null) [] = [];
  diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  paginas: grupoDTODashboardResponse [][] = [];
  paginaActual = 0;
  intervalId: any;

  hoverDia: Date | null = null;

  constructor( 
    private usuarioService : UsuarioService, 
    private loginService : LoginService,
    private grupoService : GrupoService,
    private sesionService : SesionesService,
    private router : Router
    
  ){}

  ngOnInit(): void {
    this.fechaActual = new Date();
    this.mesActual = this.fechaActual.getMonth();
    this.anioActual = this.fechaActual.getFullYear();
    this.mesBase = this.mesActual;
    this.anioBase = this.anioActual;
    this.saludo = this.getSaludo();
    this.cargarUsuarioActual();
    this.generarMes();
    this.iniciarAutoPlay();
      
  }


  cargarUsuarioActual(){
    this.loginService.getCurrentUser().subscribe({
      next : (data) => { 
        this.idUsuario = data.id;
        this.usuarioService.obtenerUsuarioId(this.idUsuario).subscribe({
          next: (data)=>{
            this.usuarioActual = data;
            this.cargarGruposDocente();
            this.cargarSesionesDocente();
          }
        })
      } 
    });

  }
  cargarGruposDocente(){
    this.grupoService.getPorDocente(this.usuarioActual.idUsuario).subscribe({
      next : (data) =>{
        this.grupos = data;
        this.crearPaginas();
      
      }
    });

  }
  cargarSesionesDocente(){
    this.sesionService.obtenerSesionesDocente(this.usuarioActual.idUsuario).subscribe({
      next : (data) => {
        this.sesiones = data;
      }
    })
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

crearPaginas (){
  const size = 3;
  for (let i = 0; i < this.grupos.length; i += size) {
    this.paginas.push(this.grupos.slice(i, i + size));
  }
}

irAPagina(index: number) {
  this.paginaActual = index;
    this.pausarAutoPlay();
    this.reanudarAutoPlay();
}


iniciarAutoPlay() {
  this.intervalId = setInterval(() => {
    this.siguientePagina();
  }, 4000); // cada 4 segundos
}
siguientePagina() {
  if (this.paginaActual < this.paginas.length - 1) {
    this.paginaActual++;
  } else {
    this.paginaActual = 0; // loop
  }
}
pausarAutoPlay() {
  clearInterval(this.intervalId);
}
reanudarAutoPlay() {
  this.iniciarAutoPlay();
}



generarMes() {
  this.diasMes = [];
  const hoy = new Date();
  
  //calcular cuando empieza el mes
  const primerDia = new Date(this.anioActual, this.mesActual, 1);
  const ultimoDia = new Date(this.anioActual, this.mesActual + 1, 0);

  //ver en que dia cae el primer dia
  let diaSemana = primerDia.getDay();

  //verificar  si el primer dia es domingo 
  diaSemana = diaSemana === 0 ? 6 : diaSemana - 1;

  //calcular los espacios vacios
  for (let i = 0; i < diaSemana; i++) {
    this.diasMes.push(null);
  }
  for (let i = 1; i <= ultimoDia.getDate(); i++) {
    this.diasMes.push(new Date(this.anioActual, this.mesActual, i));
  }
}
tieneSesion(dia: Date): boolean {
  return this.sesiones.some(s =>{
    const fechaSesion = this.convertirFecha(s.fecha);
    return fechaSesion.toDateString() === dia.toDateString();
  });
}
getNombreMes(): string {
  const mes = new Date(this.anioActual, this.mesActual)
    .toLocaleString('es-MX', { month: 'long' });

  return mes.charAt(0).toUpperCase() + mes.slice(1);


}
mesAnterior() {
  if (!this.puedeRetroceder()) return;

  this.mesActual--;

  if (this.mesActual < 0) {
    this.mesActual = 11;
    this.anioActual--;
  }

  this.generarMes();
}
mesSiguiente() {
  if (!this.puedeAvanzar()) return;

  this.mesActual++;

  if (this.mesActual > 11) {
    this.mesActual = 0;
    this.anioActual++;
  }

  this.generarMes();
}
puedeAvanzar(): boolean {
  const actual = new Date(this.anioActual, this.mesActual);
  const limite = new Date(this.anioBase, this.mesBase + 3);

  return actual < limite;
}
puedeRetroceder(): boolean {
  const actual = new Date(this.anioActual, this.mesActual);
  const base = new Date(this.anioBase, this.mesBase);

  return actual > base;
}

obtenerSesionesDia(dia: Date) {
  return this.sesiones.filter(s => {
    const fecha = this.convertirFecha(s.fecha);
    return fecha.toDateString() === dia.toDateString();
  });
}
formatearHora(fechaStr: string): string {
  const fecha = this.convertirFecha(fechaStr);
  return fecha.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

verGrupo(grupo: grupoDTODashboardResponse){
    
    this.router.navigate(['/docente-dashboard/grupo/', grupo.idGrupo])
      .then(() => {
      console.log(grupo);
      console.log(grupo.idGrupo);
        console.log("Nueva URL:", this.router.url);
      });
  }
}
