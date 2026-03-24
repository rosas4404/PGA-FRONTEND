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
import { GrupoComponent } from './pages/grupo/grupo.component';
import { InscripcionComponent } from './pages/inscripcion/inscripcion.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { CursoComponent } from './pages/curso/curso.component';
import { CampoFormativoComponent } from './pages/campo-formativo/campo-formativo.component';
import { ActividadBaseComponent } from './pages/actividad-base/actividad-base.component';
import { DocumentoComponent } from './pages/documento/documento.component';
import { ExpedienteComponent } from './pages/expediente/expediente.component';
import { ConsultaRevisonComponent } from './pages/consulta-revision/consulta-revision.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ExpdienteAlumnoComponent } from './pages/expdiente-alumno/expdiente-alumno.component';


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
        children:[
            {path:'perfil', component: PerfilComponent},
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
