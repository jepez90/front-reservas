import { MyDate } from './MyDate';

export interface FetchDataOptions {
  params: {};
  url?: string;
}
export interface ReserveFetchData extends FetchDataOptions {
  params: {
    plate?: string;
    date?: string;
    car_type?: number;
  };
}

export interface IDataReservRequest {
  id?: number;
  driver: string;
  date: MyDate;
  hour: string;
  plate: string;
  ended: boolean;
  active: boolean;
  car_type: number;
  rev_type: number;
  owner: number;
  options?: { [key:string]: string };
}

export interface IDataReserv extends IDataReservRequest {
  id: number;
  driver: string;
  hour: string;
  plate: string;
  ended: boolean;
  active: boolean;
  car_type: number;
  rev_type: number;
  owner: number;
  options?: { [key:string]: string };
}
