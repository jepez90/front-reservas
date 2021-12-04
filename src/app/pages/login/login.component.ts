import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoginData, LoginResponse } from 'src/app/interfaces/login';
import { UsersService } from 'src/app/services/users/users.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  usernameError: string = '';

  password: string = '';
  passwordError: string = '';

  icons = [faSpinner];

  isConnecting = false;

  errorMessage = '';

  @ViewChild('myForm') form!: ElementRef;
  wasValidated = false;

  constructor(private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
    if (this.usersService.isLogged()) {
      this.router.navigate(['']);
    }
  }

  onSubmit(): void {
    // checks the validation
    if (this.form.nativeElement.checkValidity()) {
      // the data is valid

      //remove the validation highlight
      this.isConnecting = true;

      this.wasValidated = false;
      const loginData: LoginData = {
        username: this.username,
        password: this.password,
      };
      this.usersService.login(loginData).subscribe({
        next: (v) => this.onSuccessResponse(v),
        error: (e) => this.onErrorResponse(e),
      });
    } else {
      this.wasValidated = true;
    }
  }

  onSuccessResponse(response: LoginResponse) {
    //redirect to the home
    this.router.navigate(['']);
  }

  onErrorResponse(err: HttpErrorResponse) {
    if (err.status == 0) {
      // exist an error in the red
      this.errorMessage = `No se pudo establecer la conexión con el servidor<br />
      <strong>Error:</strong><br />${err.message}`;
    } else {
      // if is an error returned by the API
      this.passwordError = err.error.password;

      this.usernameError = err.error.username;
    }

    this.isConnecting = false;
  }

  onType(evt: Event) {
    let elementName = (<HTMLInputElement>evt.target).name;
    if (elementName === 'username') {
      this.usernameError = '';
    }
    if (elementName === 'password') {
      this.passwordError = '';
    }
  }
}
