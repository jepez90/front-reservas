import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from './services/notifications/notifications.service';
import { Notification } from './services/notifications/NotificationClass';
import { UsersService } from './services/users/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private usersService: UsersService,
    private router: Router,
    private notifyService: NotificationsService
  ) { }

  ngOnInit(): void {

    //checks if the user has a session
    if (!this.usersService.isLogged()) {
      if (this.usersService.getSession()) {
        const notifConfig = { title: "Su sesion ha expirado", icon: "faUserLock", bodyClass: "alert-danger" }
        const notif = new Notification('Inicio de sesion', notifConfig);
        this.notifyService.showNotification(notif);
      }
      this.router.navigate(["login"]);
    }
  }

  title = 'Reservas';
}
