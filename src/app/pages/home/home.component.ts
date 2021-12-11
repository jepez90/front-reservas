import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Output } from '@angular/core';
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
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  carType: number = 0;
  carPlate: string = "";
  chosenDate: string = "";


  wasValidated = true;
  icons = [faEllipsisV, faUserCog];

  data: Array<any> = [];

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
    this.carType = parseInt((<HTMLInputElement>evt.target).name);
    let data: ReserveFetchData = {
      params: {}
    }
    if (this.carPlate != "") {
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


  }
  onErrorFetch(err: HttpErrorResponse): void {
    console.log(err.message)
  }
  onSuccessFetch(v: any): void {

    this.data = v.results;

  }
  checki(i: any): boolean {
    return i == this.carType;
  }

}
