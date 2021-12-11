import { Component, Input, OnInit } from '@angular/core';
import { ReservesService } from 'src/app/services/reserves/reserves.service';

@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.css']
})
export class DataViewComponent implements OnInit {

  @Input() set data(value: Array<any>) {
    this._data = value;
    //show the modal window
  }

  _data:Array<any> = [];

  hideEnded:boolean = true;

  constructor(public service: ReservesService) { }

  ngOnInit(): void {
  }

}
