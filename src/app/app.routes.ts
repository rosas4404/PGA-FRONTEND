import { Routes } from '@angular/router';
import { RegistroUsuarioComponent } from './pages/registro-usuario/registro-usuario.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminDashboardComponent } from './pages/dashboard/admin-dashboard/admin-dashboard.component';
import { adminGuard } from './services/guard/admin.guard';
import { docenteGuard } from './services/guard/docente.guard';
import { alumnoGuard } from './services/guard/alumno.guard';
import { LoginComponent } from './pages/login/login.component';
import { PasswordComponent } from './pages/password/password.component';


export const routes: Routes = [
    {path:'registro', component: RegistroUsuarioComponent},
    {path:'home', component:HomeComponent},
    {path: 'admin-dashboard', component:AdminDashboardComponent, canActivate:[adminGuard]},
    {path: 'docente-dashboard', component:AdminDashboardComponent, canActivate:[docenteGuard]},
    {path: 'alumno-dashboard', component:AdminDashboardComponent, canActivate:[alumnoGuard]},
    {path: 'login', component:LoginComponent},
    {path: 'password', component:PasswordComponent},
    {path: '**', redirectTo:''}//por si la ruta no existe 
];
