import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';
import { MyDate } from '../date-picker/MyDate';

export interface IDateReserv {
  id: number;
  driver: string;
  registered_date: Date;
  updated_date: Date;
  date: MyDate;
  hour: string;
  plate: string;
  ended: boolean;
  active: boolean;
  car_type: number;
  rev_type: number;
  owner: number;
}
@Component({
  selector: 'app-data-edit',
  templateUrl: './data-edit.component.html',
  styleUrls: ['./data-edit.component.css'],
})
export class DataEditComponent implements OnInit {
  private _data!: IDateReserv;
  @ViewChild('modalEdit') modalEdit!: ElementRef;

  @Input() set data(value: IDateReserv) {

    this._data = value;
    this.showModal();
  }

  constructor() {}

  ngOnInit(): void {
    window.setTimeout(this.showModal, 1000, this);
    console.log(this.modalEdit);
  }

  showModal() {
    const modal = new Modal(this.modalEdit.nativeElement);
    modal.show();
  }
  
  public get data(): IDateReserv {
    return this._data;
  }
}
