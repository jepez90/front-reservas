import { Component, Input, OnInit } from '@angular/core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { ReservesService } from 'src/app/services/reserves/reserves.service';
import { IDateReserv } from '../data-edit/data-edit.component';
import { MyDate } from '../date-picker/MyDate';

@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.css'],
})
export class DataViewComponent implements OnInit {
  now: MyDate;
  today: string;

  @Input() set data(value: Array<any>) {
    this._data = value;
    this.now = new MyDate();
    //show the modal window
  }
  public icons = fas;

  _data!: Array<IDateReserv>;

  hideEnded: boolean = true;

  reserv!: IDateReserv;

  constructor(public service: ReservesService) {
    this.now = new MyDate();
    this.today = this.now.getISODate();
  }

  ngOnInit(): void {}

  isNow(reserve: any): boolean {
    if (this.today !== reserve.date) {
      return false;
    }
    const dateSplit = reserve.hour.split(':');
    return (
      this.now.getHours() == dateSplit[0] &&
      this.now.getMinutes() < dateSplit[1]
    );
  }

  showModal(evt: Event) {
    const target = <HTMLElement>evt.target;
    const id = parseInt(target.id.split('_')[2]);
    console.log(id);
    this.reserv = this._data[id];
  }
}
