export interface LoginData {
  username: string,
  password: string
}
export interface LoginResponse extends LoginData {
  token: string
}
