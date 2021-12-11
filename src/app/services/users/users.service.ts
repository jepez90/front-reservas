import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LoginData, LoginResponse } from 'src/app/types/login';
import { Notification } from 'src/app/services/notifications/NotificationClass';
import { environment } from 'src/environments/environment';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private urlAPI: string = environment.API_URL;
  private pathLogin = 'accounts/login/';
  private url = `${this.urlAPI}${this.pathLogin}`;
  private jwtId = 'argsetgrsthsdrthsdrthdyhrth';

  private login$ = new Subject<LoginResponse>();

  constructor(
    private http: HttpClient,
    private notifService: NotificationsService
  ) { }

  requestLogin(data: LoginData): Observable<LoginResponse> {
    /** remove the previous observable, because if the request was failed,
     * the sistema unsubscribe automatically
     * */
    this.login$.unsubscribe();
    //creates a new observable
    this.login$ = new Subject<LoginResponse>();

    // perform the http request
    this.http.post<LoginResponse>(this.url, data).subscribe({
      next: (v) => {
        // execute this function when the request was successful,
        this.onSuccessResponse(v);
        // send the response to the observers
        this.login$.next(v);
      },
      error: (e) => {
        // execute this function when the request has error,
        // to show the modal error if the error has code 0
        this.onErrorLogin(e);
        // send the error to the observers
        this.login$.error(e);
      },
    });
    // return the observable
    return this.login$.asObservable();
  }

  isLogged(): boolean {
    // test if exist any previous login
    const t = localStorage.getItem(this.jwtId);
    if (!t) {
      return false;
    }

    // check if the previous login was expired
    const expNumber = this.parseJwt(t).exp * 1000;
    const expTime: Date = new Date(expNumber);
    if (expTime < new Date()) {
      return false;
    }
    return true;
  }

  logOut() {
    localStorage.removeItem(this.jwtId);
  }

  getSession() {
    return localStorage.getItem(this.jwtId);
  }

  private onSuccessResponse(v: LoginResponse) {
    this.storeToken(v);

    // perform a notification of succesfull login

    const notifConfig = { title: 'Inicio de sesion', icon: "faUserCheck" }
    const notif = new Notification(`Bienvenido ${v.username}`, notifConfig);
    this.notifService.showNotification(notif);
  }

  private onErrorLogin(e: HttpErrorResponse): void {
    // if exist an error in the red
    // show a notification with the information
    // the other errors was handled by the view
    if (e.status == 0) {
      const errorMessage = `No se pudo establecer la conexión con el servidor<br />
      <strong>Error:</strong><br />${e.message}`;
      this.notifService.showErrorModal(errorMessage);
    }
  }

  private storeToken(loginResponse: LoginResponse) {
    localStorage.setItem(this.jwtId, loginResponse.token);
  }

  private parseJwt(token: string): any {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }
}
