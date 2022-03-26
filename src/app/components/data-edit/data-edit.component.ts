import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';
import { ReservesService } from 'src/app/services/reserves/reserves.service';
import { IDataReserv } from 'src/app/types/reservs';

@Component({
  selector: 'app-data-edit',
  templateUrl: './data-edit.component.html',
  styleUrls: ['./data-edit.component.css'],
})
export class DataEditComponent implements OnInit {
  private _data!: IDataReserv;

  @ViewChild('modalEdit') modalEdit!: ElementRef;

  constructor(private _service: ReservesService) {}

  ngOnInit(): void {
    this.service.reservsToEdit$.subscribe({
      next: (data) => {
        this.data = data;
        this.showModal();
      },
    });
  }

  showModal() {
    const modal = new Modal(this.modalEdit.nativeElement);
    modal.show();
  }

  public get data(): IDataReserv {
    return this._data;
  }
  public set data(value: IDataReserv) {
    this._data = value;
  }

  public get service(): ReservesService {
    return this._service;
  }
}
