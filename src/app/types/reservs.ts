export interface FetchDataOptions{
  params:{},
  url?: string
}
export interface ReserveFetchData extends FetchDataOptions {
  params: {
    plate?: string,
    date?: string,
    car_type?: number,
  }
}


