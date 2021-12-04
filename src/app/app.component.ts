import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from './services/users/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private usersService: UsersService, private router: Router) {

  }
  ngOnInit(): void {

    //checks if the user has a session
    if (!this.usersService.isLogged()) {
      this.router.navigate(["login"]);
    }
  }

  title = 'Reservas';
}
