export class MyTime extends Date {
  constructor(value: string) {
    super(0);
    this.strTime = value;
  }

  public get strTime(): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    const s = new Intl.DateTimeFormat(undefined, options);
    return s.format(this);
  }

  public set strTime(value: string) {
    const data = value.split(':');
    if (data.length < 2) {
      throw new TypeError("Invalid Format- it Could be 'hh:mm:ss'");
    }
    this.setHours(parseInt(data[0]));
    this.setMinutes(parseInt(data[1]));
    if (data[2]) {
      this.setMinutes(parseInt(data[2]));
    }
    
  }
}
