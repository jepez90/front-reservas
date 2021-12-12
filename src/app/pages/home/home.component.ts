import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faEllipsisV, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { ReservesService } from 'src/app/services/reserves/reserves.service';
import { ReserveFetchData } from 'src/app/types/reservs';


class MyDate extends Date {
  constructor(stringDate: string = "") {
    super();
    if (stringDate != "") {
      stringDate.split("-");
      console.log(stringDate)
    }
  }

  getISODate(): string {
    let m: string = (this.getMonth() + 1).toString();
    if (m.length == 1) {
      m = '0' + m;
    }
    let d: string = this.getDate().toString();
    if (d.length == 1) {
      d = '0' + d;
    }
    const y = this.getFullYear().toString();
    const a = `${y}-${m}-${d}`;
    return a
  }
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})

export class HomeComponent implements OnInit {

  private carType: number = 0;
  public carPlate: string = "";
  public chosenDate: string = "";
  public dateError: string = "";
  public wasValidated = false;
  public icons = [faEllipsisV, faUserCog];

  data: Array<any> = [];
  @ViewChild('customDataForm') form!: ElementRef;

  constructor(public service: ReservesService) {
    // let today = new MyDate()
    let today = new MyDate()
    today.setMonth(9);
    today.setDate(18);
    this.chosenDate = today.getISODate()
  }



  ngOnInit(): void {

  }

  handleSubmit(evt: Event) {
    if (this.form.nativeElement.checkValidity()) {
      this.carType = parseInt((<HTMLInputElement>evt.target).name);
      let data: ReserveFetchData = {
        params: {}
      }

      if (this.carPlate != "") {
        // when a plate is given, doesn't highlight any submit button
        this.carType = -1;
        data.params.plate = this.carPlate;
        this.service.fetchPlateList(data).subscribe({
          next: (v) => this.onSuccessFetch(v),
          error: (e) => this.onErrorFetch(e),
        });
      }
      else {
        data.params.date = this.chosenDate;
        data.params.car_type = this.carType + 1;

        this.service.fetchDayList(data).subscribe({
          next: (v) => this.onSuccessFetch(v),
          error: (e) => this.onErrorFetch(e),
        });
      }

      this.wasValidated = false;
    }
    else {
      this.wasValidated = true;
    }

  }

  /**
   * validates the date in the field date when the input event is fired
   * @param event object of the event 
   */
  validateDate(event: Event): void {
    const pattern = /\d{4}-\d{2}-\d{2}/;
    const value = (<HTMLInputElement>event.target).value;
    if (!pattern.test(value)) {
      this.dateError = "El formato de la fecha es YYYY-MM-DD";
    }
    else if (isNaN(Date.parse(value))) {
      this.dateError = "Fecha No Valida";
    } else {
      this.dateError = "";
    }

    (<HTMLInputElement>event.target).setCustomValidity(this.dateError);

  }
  onErrorFetch(err: HttpErrorResponse): void {
    console.log(err.message)
  }
  onSuccessFetch(v: any): void {

    this.data = v.results;

  }

  /**
   * 
   * @param i index if the submit button when it is rendering
   * @returns true if i make  match with cartype, false otherwise
   */
  checkCartype(i: number): boolean {
    return i == this.carType;
  }

}
