import { MyDate } from 'src/app/types/MyDate';
import { MyTime } from 'src/app/types/MyTime';

export class ScheduleDay {
  private _date: MyDate;
  private _openAt: MyTime;
  private _closeAt: MyTime;
  private _isOpen: boolean = true;
  private _dayOfWeek: number;
  private _groupedBy: number;
  private _byDefault: boolean = true;
  private _comment?: string | undefined;
  private _segments: Array<ScheduleDaySegment> = [];
  public group?: number[] = [];
  public isRemoving?: boolean = false;

  constructor(date: MyDate) {
    this._date = date;
    this._dayOfWeek = date.getDay();
    this._groupedBy = this._dayOfWeek;
    this._openAt = new MyTime('00:00');
    this._closeAt = new MyTime('00:00');
    this.addSegment({
      start: this._openAt,
      end: this._closeAt,
      groupXhour: '1',
      reservXgroup: '1',
    });
  }

  public divideSegment(segmentIdx: number) {
    debugger;
    const segmentToDivide = this._segments[segmentIdx];
    const end = new MyTime('0:0');
    end.setTime(segmentToDivide.end.getTime());
    const start = new MyTime('0:0');
    start.setTime(segmentToDivide.start.getTime());

    let difference = new Date((end.getTime() + start.getTime()) / 2);
    if (start.getHours() == difference.getHours()){
      if (start.getHours() - difference.getHours() < 30) {
        throw new Error('no se puede dividir menos de una hora');
      }
      start.setHours(difference.getHours())
      start.setMinutes(difference.getMinutes());
    } else {
      start.setHours(difference.getHours())
      start.setMinutes(0);
    }

    this.addSegment({
      start: start,
      end: end,
      groupXhour: '1',
      reservXgroup: '1',
    });
  }
  public addSegment(newSegment: ScheduleDaySegment) {
    const len = this._segments.length;
    if (len == 0) {
      // is the first segment
      newSegment.start = this.openAt;
      newSegment.end = this.closeAt;
      this._segments.push(newSegment);
    } else {
      //find the segmentIdx to be divided
      let segmentIdxToDivide = 0;
      this._segments.forEach((segment, idx) => {
        if (segment.end.getTime() == newSegment.end.getTime()) {
          segmentIdxToDivide = idx;
        }
      });

      //modify the end of the divided segment
      this._segments[segmentIdxToDivide].end = newSegment.start;
      // add the new segment to the end of the list
      this._segments.push(newSegment);
      // sort the elements
      this._segments.sort(
        (seg1: ScheduleDaySegment, seg2: ScheduleDaySegment) => {
          return seg1.start.getTime() - seg2.start.getTime();
        }
      );
    }
  }

  removeSegment(segmentIdx: number) {
    debugger;
    if (segmentIdx === 0) {
      // if is the first segment
      this._segments.shift();
      this._segments[0].start = this.openAt;
    } else if (this._segments.length === segmentIdx + 1) {
      // if it is the last segment
      this._segments.pop();
      this._segments[this._segments.length - 1].end = this.closeAt;
    } else {
      // is an segment between others
      this._segments[segmentIdx - 1].end = this._segments[segmentIdx].end;
      this._segments = this._segments.filter((el, idx) => idx != segmentIdx);
    }
    console.table(this._segments);
  }

  public totalXhour(segmentIndex: number): number {
    if (segmentIndex < this.segments.length) {
      const segment = this.segments[segmentIndex];
      return parseInt(segment.groupXhour) * parseInt(segment.reservXgroup);
    }
    return 0;
  }
  public totalXday(): number {
    let a = 0;
    this.segments.forEach((e) => {
      a += parseInt(e.groupXhour) * parseInt(e.reservXgroup);
    });
    return a;
  }

  numReservsSelection(evt: Event) {
    console.log(evt);
  }

  public get date(): MyDate {
    return this._date;
  }
  public set date(value: MyDate) {
    this._date = value;
  }
  public get openAt(): MyTime {
    return this._openAt;
  }
  public set openAt(value: MyTime) {
    this.segments[0].start = value;
    this._openAt = value;
  }
  public get closeAt(): MyTime {
    return this._closeAt;
  }
  public set closeAt(value: MyTime) {
    const len = this.segments.length;
    this.segments[len - 1].start = value;
    this._closeAt = value;
  }
  public get isOpen(): boolean {
    return this._isOpen;
  }
  public set isOpen(value: boolean) {
    this._isOpen = value;
  }
  public get dayOfWeek(): number {
    return this._dayOfWeek;
  }
  public set dayOfWeek(value: number) {
    this._dayOfWeek = value;
  }
  public get groupedBy(): number {
    return this._groupedBy;
  }
  public set groupedBy(value: number) {
    this._groupedBy = value;
  }
  public get byDefault(): boolean {
    return this._byDefault;
  }
  public set byDefault(value: boolean) {
    this._byDefault = value;
  }
  public get comment(): string | undefined {
    return this._comment;
  }
  public set comment(value: string | undefined) {
    this._comment = value;
  }

  public get segments(): Array<ScheduleDaySegment> {
    return this._segments;
  }

  public set segments(data: Array<ScheduleDaySegment>) {
    this._segments = data;
  }
}

interface ScheduleDaySegment {
  start: MyTime;
  end: MyTime;
  groupXhour: string;
  reservXgroup: string;
}
