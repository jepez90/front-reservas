import { Component, Input, OnInit } from '@angular/core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { MyDate } from './MyDate';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent implements OnInit {
  public years: number[] = [];
  public dates: {
    value: number;
    isWeekend: boolean;
    isPrev: boolean;
    isNext: boolean;
    isDisabled: boolean;
    isSelected: boolean;
  }[] = [];
  public icons = fas;
  private _date: string = '';
  public viewedDate!: MyDate;
  public activeDate!: MyDate;
  public activeField: number = -1;
  public view = 0;

  @Input() set date(value: string) {
    this._date = value;
    this.viewedDate = new MyDate(this.date);
    this.activeDate = new MyDate(this.date);
    this.updateDates();
  }
  @Output() dateChangeEvent = new EventEmitter<string>();

  public get date(): string {
    return this._date;
  }

  constructor() {
    for (let i = 0; i < 42; i++) {
      let date = {
        value: i,
        isWeekend: i % 7 == 0,
        isPrev: false,
        isNext: i > 30,
        isDisabled: false,
        isSelected: false,
      };
      this.dates.push(date);
    }
  }

  ngOnInit(): void {
    this.viewedDate = new MyDate(this.date);
    this.activeDate = new MyDate(this.date);
    this.updateDates();
  }

  public nextMonth() {
        
    let currentMont = this.viewedDate.getMonth();
    this.viewedDate.setMonth(currentMont + 1);
    this.updateDates();
  }

  public prevMonth() {
    
    console.log(this.viewedDate);
    let currentMont = this.viewedDate.getMonth();
    this.viewedDate.setMonth(currentMont - 1);
    this.updateDates();
  }

  public daySelection(event: Event) {

    const source = <HTMLElement>event.target;
    if (!source) {
      return;
    }
    let id = source.id.match(/\d+/);
    if (!id) {
      throw new Error('Ivalid Format of the id');
    }
    const dateId = parseInt(id[0]);
    let newMonth = this.viewedDate.getMonth();
    let newDay = this.dates[dateId].value;
    if (this.dates[dateId].isPrev) {
      newMonth -= 1;
    } else if (this.dates[dateId].isNext) {
      newMonth += 1;
    }

    this.viewedDate.setMonth(newMonth, newDay);
    this.activeDate.setTime(this.viewedDate.getTime());
    this.updateDates();
    this.date = this.activeDate.getISODate();
    this.dateChangeEvent.emit(this.date);
  }

  monthSelection(event: Event) {

    const source = <HTMLElement>event.target;
    if (!source) {
      return;
    }
    let id = source.id.match(/\d+/);
    if (!id) {
      throw new Error('Ivalid Format of the id');
    }
    const monthId = parseInt(id[0]);

    this.viewedDate.setMonth(monthId);
    this.view = 0;

    this.updateDates();
  }

  yearSelection(event: Event) {
        
    let source = <HTMLElement>event.target;
    if (!source) {
      return;
    }
    let id;
    while (source.parentElement) {
      if (source.nodeName == 'DIV' && source.id.match(/\d+/)) {
        id = source.id.match(/\d+/);
        break;
      } else {
        source = source.parentElement;
      }
    }

    if (!id) {
      throw new Error('Ivalid Format of the id');
    }

    const yearId = parseInt(id[0]);

    if (yearId == 100) {
      // update the list with the previous years
      this.years = this.years.map((y) => y - 18);
    } else if (yearId == 200) {
      // update the list with the next years
      this.years = this.years.map((y) => y + 18);
    } else {
      let year = this.years[yearId];
      this.viewedDate.setFullYear(year);
      this.view = 1;
    }
  }

  showMonthSelector() {
    if (this.view == 1) {
      this.view = 0;
    } else {
      this.view = 1;
    }
  }
  showYearSelector() {
    if (this.view == 2) {
      this.view = 0;
    } else {
      this.view = 2;
      // fill the years list
      let year = this.viewedDate.getFullYear();
      year -= 8;
      this.years = [];
      for (let i = 0; i < 18; i++) {
        this.years.push(year);
        year++;
      }
    }
  }

  private updateDates() {
    
    // fill last days of the previous month

    // find the last day of the week of the previous month
    const date = new Date(
      this.viewedDate.getFullYear(),
      this.viewedDate.getMonth(),
      0
    );
    let lastDay = date.getDay();

    if (lastDay == 6) {
      lastDay = -1;
    }

    // find the last date of the previous month
    let lastDate = date.getDate();
    // fill the days of the week of the previous mont
    for (let i = lastDay; i >= 0; i--) {
      this.dates[i].value = lastDate;
      this.dates[i].isPrev = true;
      lastDate--;
    }

    // fill the days of the current month

    // get last date of the current month
    date.setMonth(date.getMonth() + 2, 0);
    lastDate = date.getDate();

    //fill the values from 1 to last date of the current month
    for (let i = 1; i <= date.getDate(); i++) {
      // the field is the value of the day + the last day of the previous month
      this.dates[i + lastDay].value = i;
      this.dates[i + lastDay].isPrev = false;
      this.dates[i + lastDay].isNext = false;
    }

    //fill values for the days of the next month

    for (let i = 1; i < 42 - lastDate - lastDay; i++) {
      this.dates[i + lastDay + lastDate].value = i;
      this.dates[i + lastDay + lastDate].isNext = true;
    }

    // hishligth the selecterd date
    if (this.activeField != -1) {
      this.dates[this.activeField].isSelected = false;
    }
    if (this.viewedDate.getMonth() == this.activeDate.getMonth()) {
      this.activeField = this.activeDate.getDate() + lastDay;
      this.dates[this.activeField].isSelected = true;
    } else {
      this.activeField = -1;
    }
  }

  public readonly DAYS = [
    { name: 'Domingo', shortName: 'Dom', xsName: 'D' },
    { name: 'Lunes', shortName: 'Lun', xsName: 'L' },
    { name: 'Martes', shortName: 'Mar', xsName: 'M' },
    { name: 'Miércoles', shortName: 'Mié', xsName: 'M' },
    { name: 'Jueves', shortName: 'Jue', xsName: 'J' },
    { name: 'Viernes', shortName: 'Vie', xsName: 'V' },
    { name: 'Sábado', shortName: 'Sáb', xsName: 'S' },
  ];

  public readonly MONTHS = [
    { name: 'Enero', shortName: 'Ene' },
    { name: 'Febrero', shortName: 'Feb' },
    { name: 'Marzo', shortName: 'Mar' },
    { name: 'Abril', shortName: 'Abr' },
    { name: 'Mayo', shortName: 'May' },
    { name: 'Junio', shortName: 'Jun' },
    { name: 'Julio', shortName: 'Jul' },
    { name: 'Agosto', shortName: 'Ago' },
    { name: 'Septiembre', shortName: 'Sep' },
    { name: 'Octubre', shortName: 'Oct' },
    { name: 'Noviembre', shortName: 'Nov' },
    { name: 'Diciembre', shortName: 'Dic' },
  ];
}
