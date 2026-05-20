import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AdminDashboardComponent } from './pages/dashboard/admin-dashboard/admin-dashboard.component';
import { adminGuard } from './services/guard/admin.guard';
import { docenteGuard } from './services/guard/docente.guard';
import { alumnoGuard } from './services/guard/alumno.guard';
import { LoginComponent } from './pages/login/login.component';
import { PasswordComponent } from './pages/password/password.component';
import { docenteAlumnoGuard } from './services/guard/docente-alumno.guard';
import { authGuard } from './services/guard/auth.guard';
import { DocenteDashboardComponent } from './pages/dashboard/docente-dashboard/docente-dashboard.component';
import { AlumnoDashboardComponent } from './pages/dashboard/alumno-dashboard/alumno-dashboard.component';
import { GrupoComponent } from './pages/Administrador/grupo/grupo.component';
import { InicioComponent } from './pages/Docente/inicio/inicio.component';
import { UsuariosComponent } from './pages/Administrador/usuarios/usuarios.component';
import { InscripcionComponent } from './pages/Administrador/inscripcion/inscripcion.component';
import { CursoComponent } from './pages/Administrador/curso/curso.component';
import { CampoFormativoComponent } from './pages/Administrador/campo-formativo/campo-formativo.component';
import { ActividadBaseComponent } from './pages/Administrador/actividad-base/actividad-base.component';
import { DocumentoComponent } from './pages/Administrador/documento/documento.component';
import { ConsultaRevisonComponent } from './pages/Administrador/consulta-revision/consulta-revision.component';
import { ExpedienteComponent } from './pages/Administrador/expediente/expediente.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ExpdienteAlumnoComponent } from './pages/Alumno/expdiente-alumno/expdiente-alumno.component';
import { SesionesComponent } from './pages/Docente/sesiones/sesiones.component';
import { InicioGrupoComponent } from './pages/Docente/inicio-grupo/inicio-grupo.component';
import { PanelGrupoComponent } from './pages/Docente/panel-grupo/panel-grupo.component';
import { ActividadesGrupoComponent } from './pages/Docente/actividades-grupo/actividades-grupo.component';
import { ActividadComponent } from './pages/Docente/actividad/actividad.component';
import { SesionGrupoComponent } from './pages/Docente/sesion-grupo/sesion-grupo.component';
import { AlumnosGrupoComponent } from './pages/Docente/alumnos-grupo/alumnos-grupo.component';
import { InicioAdminComponent } from './pages/Administrador/inicio-admin/inicio-admin.component';
import { RegistroActividadesComponent } from './pages/Docente/registro-actividades/registro-actividades.component';
import { InicioAlumnoComponent } from './pages/Alumno/inicio-alumno/inicio-alumno.component';
import { InicioGrupoHabilitadoComponent } from './pages/Alumno/inicio-grupo-habilitado/inicio-grupo-habilitado.component';
import { PanelGrupoAlumnoComponent } from './pages/Alumno/panel-grupo-alumno/panel-grupo-alumno.component';
import { InicioGruposDeshaComponent } from './pages/Alumno/inicio-grupos-desha/inicio-grupos-desha.component';
import { GrupoDeshabilitadoComponent } from './pages/Alumno/grupo-deshabilitado/grupo-deshabilitado.component';
import { SesionesAlumnoComponent } from './pages/Alumno/sesiones-alumno/sesiones-alumno.component';
import { ActividadesAlumnoComponent } from './pages/Alumno/actividades-alumno/actividades-alumno.component';
import { ActividadAlumnoComponent } from './pages/Alumno/actividad-alumno/actividad-alumno.component';
import { SeguimientoSemanalComponent } from './pages/Alumno/seguimiento-semanal/seguimiento-semanal.component';


export const routes: Routes = [
    
    { path:'', component:HomeComponent,
        children : [
            {path: 'admin-dashboard', component:AdminDashboardComponent, canActivate:[adminGuard],
                children:[
                  { path: '', redirectTo: 'inicioAdmin', pathMatch: 'full' },
                  {path: 'inicioAdmin', component : InicioAdminComponent},
                    {path:'usuarios',
                        children:[ 
                            { path: 'alumnos', component: UsuariosComponent, data: {usuario: 'alumnos'}},
                            { path: 'docentes', component: UsuariosComponent, data: {usuario: 'docentes'}}
                        ]
                    },
                    {path:'inscripcion', component: InscripcionComponent},
                    {path: 'grupos', component:GrupoComponent},
                    {path: 'cursos', component:CursoComponent},
                    {path: 'campos', component: CampoFormativoComponent},
                    {path: 'catalogo-actividades', component: ActividadBaseComponent},

                    {path: 'documentos', component:DocumentoComponent},
                    {path: 'consulta-revision',
                        children:[
                            { path: '', component: ConsultaRevisonComponent },
                            { path: ':idUsuario', component: ConsultaRevisonComponent },
                            { path: ':idUsuario/expedientes', component: ExpedienteComponent }
                        ]
                    },
                    {path:'perfil', component: PerfilComponent},
                ]
            },
            {path: 'docente-dashboard', component:DocenteDashboardComponent, canActivate:[docenteGuard],
                children : [
                    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
                    {path:'perfil', component: PerfilComponent},
                    {path: 'inicio', component : InicioComponent},
                    {path: 'sesiones', component : SesionesComponent},
                    {path: 'actividades', component : RegistroActividadesComponent},
                    {path:'grupo/:idGrupo/:nombre' , component:PanelGrupoComponent,
                        children:[
                            { path: '', component: InicioGrupoComponent },
                            { path: 'actividades',
                                children: [
                                { path: '', component: ActividadesGrupoComponent },
                                { path: ':idActividad', component: ActividadComponent }
                                ]
                            },
                            { path: 'sesiones', component:SesionGrupoComponent},
                            { path: 'participantes', component:AlumnosGrupoComponent}
                        ]
                    }
                ]
            },
            {path: 'alumno-dashboard', component:AlumnoDashboardComponent, canActivate:[alumnoGuard],
                children:[
                    { path: '', redirectTo: 'inicioAlumno', pathMatch: 'full' },
                    {path:'inicioAlumno', component : InicioAlumnoComponent},
                    {path:'perfil', component: PerfilComponent},
                    {path:'expediente-alumno', component: ExpdienteAlumnoComponent},
                    {path:'panel-grupo-alumno', component: PanelGrupoAlumnoComponent,
                        children:[
                            { path: '', component: InicioGrupoHabilitadoComponent},
                            { path: 'sesiones-alumno', component: SesionesAlumnoComponent},
                            { path: 'actividades-alumno',
                                children:[
                                    { path: '', component: ActividadesAlumnoComponent},
                                    { path: ':idActividadAlumno/:idInscripcion', component: ActividadAlumnoComponent }
                                ]
                            },
                            {path: 'seguimiento', component: SeguimientoSemanalComponent}
                        ]
                    },
                    {path:'inicio-grupos-desh',
                        children:[
                            { path: '', component: InicioGruposDeshaComponent},
                            { path:'grupo-deshabilitado/:idInscripcion/:idGrupo', component: GrupoDeshabilitadoComponent,
                                children: [
                                    { path: '', component: InicioGrupoHabilitadoComponent}
                                ]
                            },
                        ]
                    }
                ]
            },
            {path: 'login', component:LoginComponent},
            {path: 'password', component:PasswordComponent, canActivate:[authGuard]},
            {path: '**', redirectTo:''}
        ]
    },
];
