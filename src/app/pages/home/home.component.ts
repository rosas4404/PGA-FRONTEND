import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(public loginService:LoginService){}

  public logout(){
    this.loginService.logout();
    window.location.reload();
  }

}
