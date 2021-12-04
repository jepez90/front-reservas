import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LoginData, LoginResponse } from 'src/app/interfaces/login';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private urlAPI: string = environment.API_URL;
  private pathLogin = "accounts/login/"
  private jwtId = "argsetgrsthsdrthsdrthdyhrth";

  constructor(private http: HttpClient) { }

  login(data: LoginData): Observable<any> {
    const url = `${this.urlAPI}${this.pathLogin}`

    return this.http.post<LoginResponse>(url, data).pipe(
      map(response => {
        this.onSuccessResponse(response);
        return response;
      })
    );
  }
  private onSuccessResponse(v: LoginResponse) {
    this.storeToken(v);
  }

  isLogged(): boolean {
    const t = localStorage.getItem(this.jwtId);
    if (!t) {
      return false
    }
    const expNumber = this.parseJwt(t).exp * 1000
    const expTime: Date = new Date(expNumber)
    if (expTime < new Date()) {
      return false
    }
    return true
  }

  logOut(){
    localStorage.removeItem(this.jwtId);
  }

  getSession(){
    return localStorage.getItem(this.jwtId);
  }

  private storeToken(loginResponse: LoginResponse) {
    localStorage.setItem(this.jwtId, loginResponse.token)
  }
  private parseJwt(token: string): any {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };
}
