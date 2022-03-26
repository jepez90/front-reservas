import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoginData, LoginResponse } from 'src/app/types/login';
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

  @ViewChild('myForm') form!: ElementRef;

  wasValidated = false;


  constructor(private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
    if (this.usersService.isLogged()) {
      this.router.navigate(['']);
    }
  }

  handleSubmit(): void {
    // checks the validation
    if (this.form.nativeElement.checkValidity()) {
      // the data is valid

      //remove the validation highlight
      this.wasValidated = false;

      //prevent to re submit the form
      this.isConnecting = true;

      // try to perform the login
      const loginData: LoginData = {
        username: this.username,
        password: this.password,
      };
      this.usersService.requestLogin(loginData).subscribe({
        next: (v) => this.onSuccessLogin(v),
        error: (e) => this.onErrorLogin(e),
      });
    } else {
      //if the data is invalid
      this.wasValidated = true;
    }
  }

  onSuccessLogin(response: LoginResponse) {
    //redirect to the home
    this.router.navigate(['settings']);
  }

  onErrorLogin(err: HttpErrorResponse) {
      // if is an error returned by the API
      this.passwordError = err.error.password;

      this.usernameError = err.error.username;

    this.isConnecting = false;
  }

  handleInputType(evt: Event) {
    let elementName = (<HTMLInputElement>evt.target).name;
    if (elementName === 'username') {
      this.usernameError = '';
    }
    if (elementName === 'password') {
      this.passwordError = '';
    }
  }
}
