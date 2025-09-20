import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

login(usernameOrEmail: string, password: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/login`, {
    username_or_email: usernameOrEmail,  // match backend
    password
  });
}
  signup(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, { username, email, password });
  }


}
