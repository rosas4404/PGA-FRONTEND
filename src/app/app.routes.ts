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
import { InicioGrupoComponent } from './pages/Docente/inicio-grupo/inicio-grupo.component';
import { PanelGrupoComponent } from './pages/Docente/panel-grupo/panel-grupo.component';
import { ActividadesGrupoComponent } from './pages/Docente/actividades-grupo/actividades-grupo.component';



export const routes: Routes = [
    
    {path:'home', component:HomeComponent},
    {path: 'admin-dashboard', component:AdminDashboardComponent, canActivate:[adminGuard],
        children:[
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
            {path:'grupo/:idGrupo' , component:PanelGrupoComponent,
                children:[
                    { path: '', component: InicioGrupoComponent },
                    { path: 'actividades', component:ActividadesGrupoComponent}
                ]
            }
        ]
    },
    {path: 'alumno-dashboard', component:AlumnoDashboardComponent, canActivate:[alumnoGuard],
        children:[
            {path:'perfil', component: PerfilComponent},
            {path:'expediente-alumno', component: ExpdienteAlumnoComponent},
        ]
    },
    {path: 'login', component:LoginComponent},
    {path: 'password', component:PasswordComponent, canActivate:[authGuard]},
    {path: '**', redirectTo:''}//por si la ruta no existe 
];
