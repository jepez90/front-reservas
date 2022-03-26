export class MyDate extends Date {
  constructor(stringDate: string = '') {
    if (stringDate != '') {
      let match = stringDate.match(/\d{4}-\d{1,2}-\d{1,2}/);
      if (match) {
        super();
        const splitted = stringDate.split('-');
        this.setFullYear(parseInt(splitted[0]));
        this.setMonth(parseInt(splitted[1]) - 1);
        this.setDate(parseInt(splitted[2]));
      } else {
        super(stringDate);
      }
    } else {
      super();
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
    return a;
  }
}
