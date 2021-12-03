import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {

  email: string = "";

  password: string = "";

  @ViewChild("myForm") form!: ElementRef;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    // checks the validation
    if (this.form.nativeElement.checkValidity()) {
      // the data is valid
      //remove the validation highlight
      this.renderer.removeClass(this.form.nativeElement, "was-validated");

      

    }
    else {
      this.renderer.addClass(this.form.nativeElement, "was-validated");
    }
  }

}
