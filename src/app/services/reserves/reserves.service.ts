import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { Notification } from 'src/app/services/notifications/NotificationClass';
import { FetchDataOptions, ReserveFetchData } from 'src/app/types/reservs';
import { environment } from 'src/environments/environment';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';

@Injectable({
  providedIn: 'root'
})
export class ReservesService {

  private urlAPI: string = environment.API_URL;
  private pathService = "reserves/"
  private pathRevType = "revtypes/"
  private pathCarType = "cartypes/"
  private _revisionTypes: string[] = [];
  private _carTypes: string[] = [];


  constructor(private http: HttpClient, private userService: UsersService, private router: Router, private notifService: NotificationsService) {
    this.fetchRevTypes();
    this.fetchCarTypes();
  }

  fetchDayList(data: ReserveFetchData): Observable<any> {
    data.url = `${this.urlAPI}${this.pathService}${data.params.date}/`
    delete data.params.date;
    return this.fetchData(data);
  }

  fetchPlateList(data: ReserveFetchData): Observable<any> {
    data.url = `${this.urlAPI}${this.pathService}`
    return this.fetchData(data);
  }

  fetchRevTypes(): void {
    const data: FetchDataOptions = { params: {} }
    data.url = `${this.urlAPI}${this.pathRevType}`
    this.fetchData(data).subscribe({
      next: (v) => {
        this.revisionTypes = v.map((el: { name: string }) => el.name);
      }
    });
  }

  fetchCarTypes(): void {
    const data: FetchDataOptions = { params: {} }
    data.url = `${this.urlAPI}${this.pathCarType}`
    this.fetchData(data).subscribe({
      next: (v) => {
        this.carTypes = v.map((el: { name: string }) => el.name);
      }
    });
  }

  private fetchData(data: FetchDataOptions): Observable<any> {
    const url = data.url;
    if (!url) {
      throw new Error("url is missing");
    }
    delete data.url;

    let payload = {
      params: data.params,
      headers: {
        Authorization: "bearer " + this.userService.getSession(),
      }
    }

    return this.http.get(url, payload).pipe(
      catchError(error => {
        if (error.status == 403) {
          //if the request has an 403 status code, the user needs login
          const notifConfig = { title: 'Inicio de sesion', icon: "faUserLock", bodyClass: "alert-danger" }
          const notif = new Notification('Su sesion ha expirado', notifConfig);
          this.notifService.showNotification(notif);
          this.router.navigate(["login"]);
        }
        return error;
      }),
    );
  }

  public get revisionTypes(): string[] {
    return this._revisionTypes;
  }
  private set revisionTypes(value: string[]) {
    this._revisionTypes = value;
  }

  public get carTypes(): string[] {
    return this._carTypes;
  }
  public set carTypes(value: string[]) {
    this._carTypes = value;
  }
}
