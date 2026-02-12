import { Routes } from '@angular/router';
import { RegistroUsuarioComponent } from './pages/registro-usuario/registro-usuario.component';
import { HomeComponent } from './pages/home/home.component';


export const routes: Routes = [
    {path:'registro', component: RegistroUsuarioComponent},
    {path:'home', component:HomeComponent},
];
