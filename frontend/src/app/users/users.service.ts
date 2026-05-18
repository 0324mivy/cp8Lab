import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { LoginService } from '../login/login.service';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient, private loginService: LoginService) {}

  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.loginService.getToken()}`,
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
  }

  getUsers() {
    return this.http.get<any[]>(`${this.api}/users`, { headers: this.getHeaders() });
  }

  addUser(name: string) {
    return this.http.post(`${this.api}/add-user`, { name }, { headers: this.getHeaders() });
  }

  updateUser(id: number, name: string) {
    return this.http.put(`${this.api}/update-user/${id}`, { name }, { headers: this.getHeaders() });
  }

  disableUser(id: number) {
    return this.http.patch(`${this.api}/disable-user/${id}`, {}, { headers: this.getHeaders() });
  }

  enableUser(id: number) {
    return this.http.patch(`${this.api}/enable-user/${id}`, {}, { headers: this.getHeaders() });
  }
}