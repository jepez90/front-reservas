import { Component, Input, OnInit } from '@angular/core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { ReservesService } from 'src/app/services/reserves/reserves.service';
import { IDataReserv } from 'src/app/types/reservs';
import { MyDate } from '../../types/MyDate';

@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.css'],
})
export class DataViewComponent implements OnInit {
  now: MyDate;

  today: string;

  public icons = fas;

  hideEnded: boolean = true;

  reserv!: IDataReserv;

  private editor$ = new Subject<IDataReserv>();

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

  handleAddReserveClick(evt: Event) {
    // get the id of the source of the element
    // source ir the target of the event
    let source = <HTMLElement>evt.target;
    if (!source) return;

    // run throug the herarchi of the dom to find the id of the source element
    let matchId;
    while (source.parentElement) {
      if (source.nodeName == 'BUTTON' && source.id.match(/\d+/)) {
        // if is an button and has an id with numbers, it is
        matchId = source.id.match(/\d+/);
        break;
      } else {
        source = source.parentElement;
      }
    }
    if (!matchId) return;

    // get the number asosiated to the id
    const id: number = parseInt(matchId[0]);
    // get the reserve linked with the id
    let reserv = {...this.service.reservsData[id]};

    // is a new ReservesService, clear the data

    reserv.driver = '';
    reserv.ended = false;
    reserv.id = 0;
    reserv.owner = 0;
    reserv.plate = '';
    // pass the data to be edited to the service
    this.service.setReservsToEdit(reserv);
  }

  handleEditReserveClick(evt: Event) {
    let source = <HTMLElement>evt.target;
    if (!source) {
      return;
    }

    let matchId;


    while (source.parentElement) {  
      if (source.nodeName == 'BUTTON' && source.id.match(/\d+/)) {
        matchId = source.id.match(/\d+/);
        break;
      } else {
        source = source.parentElement;
      }
    }
    if (!matchId) {
      return;
    }
    const id: number = parseInt(matchId[0]);
    let reserv = this.service.reservsData[id];
    this.service.setReservsToEdit(reserv);
  }
}
