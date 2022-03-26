import { Component, OnInit } from '@angular/core';
import { ScheduleDay } from './ScheduleDay';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { MyDate } from 'src/app/types/MyDate';
import { MyTime } from 'src/app/types/MyTime';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  readonly RESERVAS_X_HORA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  readonly MAX_CAPACITY = 12;
  readonly COMBINATIONS_GROUPS = [1, 2, 3, 4, 6, 12];
  readonly GROUPS_DESCRIPTION = [
    'Cada Hora',
    'Cada Media Hora',
    'Cada 20 minutos',
    'Cada 15 minutos',
    'Cada 10 minutos',
    'cada 5 minutos',
  ];
  readonly NAME_DAYS = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];
  icons = fas;
  dateFrom: string;
  data: ScheduleDay[] = [];

  constructor() {
    let date = new MyDate();
    this.dateFrom = date.getISODate();
    let a = new MyTime("9:00");
    a.strTime="13:00"
  }

  
  ngOnInit(): void {
    //fill the data
    for (let i = 0; i < 7; i++) {
      let date = new MyDate();
      date.setDate(i + 5);
      let schedule = new ScheduleDay(date);
      schedule.openAt.strTime = '07:00';
      schedule.closeAt.strTime = '15:00';

      if (i > 3) {
        //schedule.groupedBy = 3;
        schedule.addSegment({
          start: new MyTime('12:00'),
          end: new MyTime('15:00'),
          groupXhour: '2',
          reservXgroup: '1',
        });
        schedule.addSegment({
          start: new MyTime('13:00'),
          end: new MyTime('15:00'),
          groupXhour: '2',
          reservXgroup: '1',
        });
      }
      this.data.push(schedule);
    }
    this.updateGroups();
    console.dir(this.data);
  }


  /**
   * check if an option of group select needs to be disabled
   * @param reservsXgroup is the current value of the reserves selector
   * @param group group value to be checked, is an value of the list
   * COMBINATIONS_GROUPS
   * @returns
   */
  isGroupDisabled(reservsXgroup: string, group: number): boolean {
    return this.MAX_CAPACITY / parseInt(reservsXgroup) < group;
  }

  /**
   * change the selection of groups when change the selection of reserves and
   * the total of reserves per hour overflows the maximum
   * @param evt event object
   * @returns nothing
   */
  updateGroupSelection(evt: Event) {
    const target = <HTMLInputElement>evt.currentTarget;
    const value = target.value;

    let matchId = target.id.match(/\d+/g);
    if (!matchId) return;

    const day = parseInt(matchId[0]);
    const segmentIdx = parseInt(matchId[1]);
    const segment = this.data[day].segments[segmentIdx];

    let group = parseInt(segment.groupXhour);
    while (this.isGroupDisabled(value, group)) {
      group--;
    }
    segment.groupXhour = group.toString();
  }


  /**
   * Group a day with the most right non grouped day
   * @param evt
   * @returns
   */
  toGroup(evt: Event) {
    let source = <HTMLElement>evt.currentTarget;

    let matchId = source.id.match(/\d+/);
    if (!matchId) return;

    // get the number associated to the id
    const id: number = parseInt(matchId[0]);
    //debugger;
    let i = id - 1;
    while (i >= 0) {
      if (this.data[i].groupedBy == i) {
        break;
      } else {
        i--;
      }
    }
    this.data[id].isRemoving = true;
    setTimeout(() => {
      this.deleteColumn(id, i);
    }, 200);
    //source.style.marginLeft = '-100px';
  }

  /**
   * un-group a colum of a day
   * @param evt event object
   * @returns
   */
  toUngroup(evt: Event) {
    let source = <HTMLElement>evt.currentTarget;
    if (!source) return;

    let matchId = source.id.match(/\d+/);
    if (!matchId) return;

    // get the number associated to the id
    const id: number = parseInt(matchId[0]);

    const parentId = this.data[id].groupedBy;

    // get the list of the children to ungroup
    let toUngroupList = this.data[parentId].group?.filter((el) => el > id);
    // reset the own groupedBy
    this.data[id].groupedBy = id;
    this.data[id].group = toUngroupList;

    // attach each node to the new parent
    this.data[id].group?.forEach((el) => {
      this.data[el].groupedBy = id;
    });
    //remove the id from the parent group
    this.data[parentId].group = this.data[parentId].group?.filter(
      (el) => el < id
    );
  }

  /**
   * remove an row grouped your data to another day, after a time to saw the animation
   * @param id
   * @param i
   */
  deleteColumn(id: number, i: number): void {
    this.data[i].group?.push(id);
    // add the childs of the current day
    this.data[id].group?.forEach((child) => {
      this.data[i].group?.push(child);
      this.data[child].groupedBy = i;
    });
    this.data[id].groupedBy = i;
    this.data[id].group = [];

    this.data[id].isRemoving = false;
  }

  updateGroups() {
    this.data.forEach((el, i, data) => {
      let j = i + 1;
      while (data[j] && data[j].groupedBy == i) {
        el.group?.push(j);
        j++;
      }
    });
  }
}
