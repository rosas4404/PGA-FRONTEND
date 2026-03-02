import { Routes } from '@angular/router';
import { RegistroUsuarioComponent } from './pages/registro-usuario/registro-usuario.component';
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


export const routes: Routes = [
    {path:'registro', component: RegistroUsuarioComponent},
    {path:'home', component:HomeComponent},
    {path: 'admin-dashboard', component:AdminDashboardComponent, canActivate:[adminGuard],
        children:[
            {path:'inscripcion', component: InscripcionComponent},
            {path: 'grupos', component:GrupoComponent}
        ]
    },
    {path: 'docente-dashboard', component:DocenteDashboardComponent, canActivate:[docenteGuard]},
    {path: 'alumno-dashboard', component:AlumnoDashboardComponent, canActivate:[alumnoGuard]},
    {path: 'login', component:LoginComponent},
    {path: 'password', component:PasswordComponent, canActivate:[authGuard]},
    {path: '**', redirectTo:''}//por si la ruta no existe 
];
