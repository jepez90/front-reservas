import { ThrowStmt } from '@angular/compiler';
import { MyDate } from './MyDate';

interface IConfigObject {
  parentSelector?: string;
  bindedInput?: string;
  format?: string;
  language?: DatePickerLanuage;
  [key: string]: any;
}
export enum DatePickerLanuage {
  'ES',
  'EN',
}

export class DatePicker {
  private options: IConfigObject;
  public years: number[] = [];
  public dates?: {
    value: number;
    isWeekend: boolean;
    isPrev: boolean;
    isNext: boolean;
    isDisabled: boolean;
    isSelected: boolean;
  }[];
  public strings;

  private date: string = '';
  public viewedDate!: MyDate;
  public activeDate!: MyDate;
  public activeField: number = -1;
  public view = 0;
  container?: HTMLElement;

  /**
   *
   * @param parentSelector
   * @param configObject
   */
  constructor(parentSelector: string, configObject: IConfigObject = {}) {
    // set the default options
    this.options = {
      parentSelector: '',
      bindedInput: '',
      format: 'YYYY-MM-DD',
      language: DatePickerLanuage.ES,
    };

    this.strings = this._ALL_STRINGS['ES'];

    this.loadConfigs(configObject);
    this.options.parentSelector = parentSelector;
    this.buildUI();
    this.init();
    if (this.container) {
      document.querySelector(parentSelector)?.appendChild(this.container);

      const v = <HTMLElement>document.querySelector(parentSelector);
      if (v) {
        v.style.position = "relative";
      }
    }


  }

  loadConfigs(configObject: IConfigObject): void {
    // 1 load config from object
    let config = this.options;
    for (let a in configObject) {
      config[a] = configObject[a];
    }

    //load the language cstrings
    if (config.language) {
      const languages = Object.keys(this._ALL_STRINGS);
      this.strings = this._ALL_STRINGS[languages[config.language]];
    }

    // 2 load config from bind input properties

    //override the past options
    this.options = config;
  }

  init() {
    let a;
    if (this.options.bindedInput){
      a = <HTMLInputElement>document.querySelector(this.options.bindedInput);
      if (a) this.date = a.value;
    }
    console.log(a);
    console.log(this.date)
    this.viewedDate = new MyDate(this.date);
    this.activeDate = new MyDate(this.date);
    this.updateDates();
    this.updateInterface();
  }

  buildUI() {
    // fill the dates list
    this.dates = [];
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

    // creates all elements
    if (this.container && this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    } else {
      this.container = this.newElement(
        'DIV',
        'DPcontainer',
        'DatePickerContainer' + Math.random()
      );
    }

    const panel = this.newElement('DIV', 'panel');
    this.container.appendChild(panel);

    const date_panel = this.newElement('DIV', 'date-panel');
    panel.appendChild(date_panel);

    const header = this.newElement('DIV', 'date-panel-header');
    header.onmousedown = () => false;
    let arrow = this.newElement('SPAN', 'left-arrow', '', '<');
    arrow.addEventListener('click', this.prevMonth.bind(this));
    arrow.onmousedown = () => false;
    header.appendChild(arrow);

    const header_view = this.newElement('DIV', 'date-panel-header-view');
    header_view.onmousedown = () => false;

    // generates the month label
    let label = this.newElement('SPAN', 'month-label', 'DPMonthLabel');
    label.addEventListener('click', this.showMonthSelector.bind(this));
    label.onmousedown = () => false;
    header_view.appendChild(label);

    // generates the year label
    label = this.newElement('SPAN', 'year-label', 'DPYearLabel');
    label.addEventListener('click', this.showYearSelector.bind(this));
    label.onmousedown = () => false;

    header_view.appendChild(label);
    header.appendChild(header_view);

    //generates the right arrow
    arrow = this.newElement('SPAN', 'right-arrow', '', '>');
    arrow.addEventListener('click', this.nextMonth.bind(this));
    arrow.onmousedown = () => false;
    header.appendChild(arrow);

    date_panel.appendChild(header);

    // creates the views
    const body = this.newElement('DIV', 'date-panel-body');
    body.onmousedown = () => false;
    //view of dates
    const view0 = this.newElement(
      'DIV',
      ['body-day-selection', 'selector-container', 'active-view'],
      'calendar_view0'
    );
    view0.onmousedown = () => false;

    // add the day titles
    this.strings.days.short.forEach((day: string) => {
      const el = this.newElement('DIV', ['dayTitle', 'selector-item'], '', day);
      el.onmousedown = () => false;
      view0.appendChild(el);
    });

    //add the days
    this.dates?.forEach((date, i) => {
      let classes = ['day'];
      if (date.isWeekend) classes.push('weekend');
      const el = this.newElement(
        'DIV',
        classes,
        `date_${i}`,
        date.value.toString()
      );
      el.addEventListener("click", this.daySelection.bind(this));
      el.onmousedown = () => false;
      view0.appendChild(el);
    });
    body.appendChild(view0);

    //view of months
    const view1 = this.newElement(
      'DIV',
      ['body-month-selection', 'selector-container'],
      'calendar_view1'
    );

    // add the months
    this.strings.months.names.forEach((month: string, i: number) => {
      const el = this.newElement('DIV', 'month', `month_${i}`, month);
      el.addEventListener("click", this.monthSelection.bind(this));
      arrow.onmousedown = () => false;
      view1.appendChild(el);
    });
    body.appendChild(view1);

    //view of years
    const view2 = this.newElement(
      'DIV',
      ['body-year-selection', 'selector-container'],
      'calendar_view2'
    );

    /// add prev button
    let el = this.newElement('DIV', ["year", "btn-prev"], `year_100`, "<");
    el.addEventListener("click", this.yearSelection.bind(this));
    arrow.onmousedown = () => false;
    view2.appendChild(el);
    // add the years
    for (let i = 0; i < 17; i++) {
      const el = this.newElement('DIV', 'year', `year_${i}`, i.toString());
      el.addEventListener("click", this.yearSelection.bind(this));
      arrow.onmousedown = () => false;
      view2.appendChild(el);
    }
    /// add prev button
    el = this.newElement('DIV', ["year", "btn-prev"], `year_200`, ">");
    el.addEventListener("click", this.yearSelection.bind(this));
    arrow.onmousedown = () => false;
    view2.appendChild(el);


    body.appendChild(view2);

    date_panel.appendChild(body);
  }

  private updateDates() {
    if (!this.dates) {
      return;
    }
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

  updateInterface() {
    const monthName = this.strings.months.names[this.viewedDate.getMonth()];
    this.setElementContent('#DPMonthLabel', monthName);
    this.setElementContent('#DPYearLabel', this.viewedDate.getFullYear().toString());
    if (this.view == 0) {
      this.dates?.forEach((el, i) => {

        const el$ = this.container?.querySelector('#date_' + i);
        if (el$) {
          el$.textContent = el.value.toString();
          el.isNext ? el$.classList.add('next') : el$.classList.remove('next');
          el.isPrev ? el$.classList.add('prev') : el$.classList.remove('prev');
          el.isSelected
            ? el$.classList.add('selected')
            : el$.classList.remove('selected');
        }
      });
    }
    if (this.view == 1) {

      for (let i = 0; i < 12; i++) {
        let el$ = this.container?.querySelector('#month_' + i);

        if (el$) {
          if (i == this.viewedDate.getMonth()) {
            el$.classList.add("selected");
          }
          else {
            el$.classList.remove("selected");
          }
        }
      }

    }
    if (this.view == 2) {
      this.years.forEach((year, i) => {
        let el$ = this.container?.querySelector('#year_' + i);
        if (el$) {
          el$.textContent = year.toString();
          if (year == this.viewedDate.getFullYear()) {
            el$.classList.add("selected");
          }
          else {
            el$.classList.remove("selected");
          }
        }
      });
    }
  }

  public nextMonth() {
    let currentMont = this.viewedDate.getMonth();
    this.viewedDate.setMonth(currentMont + 1);
    this.updateDates();
    this.updateInterface();
  }

  public prevMonth() {
    console.log(this.viewedDate);
    let currentMont = this.viewedDate.getMonth();
    this.viewedDate.setMonth(currentMont - 1);
    this.updateDates();
    this.updateInterface();
  }

  public daySelection(event: Event) {
    if (!this.dates) {
      return;
    }
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
    this.updateInterface();
    this.writeDate();

  }

  writeDate(){
    if (this.options.bindedInput){
      const a = <HTMLInputElement>document.querySelector(this.options.bindedInput);
      if (!a) {
        return;
      }
      if (this.options.format == "YYYY-MM-DD"){
        this.date = this.activeDate.getISODate();
      }else{

      }
      a.value=this.date;
    }
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

    this.updateView();
    this.updateDates();
    this.updateInterface();
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
    this.updateView();
    this.updateDates();
    this.updateInterface();
  }

  showMonthSelector() {
    if (this.view == 1) {
      this.view = 0;
    } else {
      this.view = 1;
    }

    this.updateView();
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
    this.updateView();
  }

  private updateView() {
    this.updateDates();
    this.updateInterface();
    const view0 = this.container?.querySelector('#calendar_view0');
    const view1 = this.container?.querySelector('#calendar_view1');
    const view2 = this.container?.querySelector('#calendar_view2');
    console.log(this.view);
    if (view0 && view1 && view2) {
      this.view == 0
        ? view0.classList.add('active-view')
        : view0.classList.remove('active-view');
      this.view == 1
        ? view1.classList.add('active-view')
        : view1.classList.remove('active-view');
      this.view == 2
        ? view2.classList.add('active-view')
        : view2.classList.remove('active-view');
    }
  }

  private setElementProperty(selector: string, property: string, value: string) {
    const el$ = <HTMLElement>this.container?.querySelector(selector);
    if (el$){
      el$.setAttribute(property, value);
    }
  }
  
  private setElementContent(selector: string, value: string) {
    const el$ = <HTMLElement>this.container?.querySelector(selector);
    if (el$){
      el$.innerHTML= value;
    }
  }

  private newElement(
    tipo: string,
    className: string | string[] = '',
    id: string = '',
    contenido: string = ''
  ): HTMLElement {
    const newElement = document.createElement(tipo);

    if (className != '') {
      if (typeof className == 'string') newElement.classList.add(className);
      else {
        className.forEach((c) => {
          newElement.classList.add(c);
        });
      }
    }
    if (id != '') {
      newElement.id = id;
    }
    if (contenido != '') {
      const newText = document.createTextNode(contenido);
      newElement.appendChild(newText);
    }
    return newElement;
  }

  private readonly _ALL_STRINGS: { [key: string]: any } = {
    ES: {
      months: {
        names: [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre',
        ],
        short: [
          'Ene',
          'Feb',
          'Mar',
          'Abr',
          'May',
          'Jun',
          'Jul',
          'Ago',
          'Sep',
          'Oct',
          'Nov',
          'Dic',
        ],
      },
      days: {
        names: [
          'Domingo',
          'Lunes',
          'Martes',
          'Miércoles',
          'Jueves',
          'Viernes',
          'Sábado',
        ],
        short: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
      },
    },
    EN: {
      months: {
        names: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ],
        short: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
      days: {
        names: [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      },
    },
  };
}
