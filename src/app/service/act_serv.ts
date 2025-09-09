import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class ActService {
  private baseUrl = 'http://localhost:8080/api/activities';

  constructor(private http: HttpClient) { }

  getAllActivities(type?: string) {
    return this.http.get<any[]>(this.baseUrl, { params: type ? { type } : {} });
  }

  createActivity(activity: any): Observable<any> {
    return this.http.post(this.baseUrl, activity);
  }

  updateActivity(id: number, activity: any) {
    return this.http.put(`${this.baseUrl}/${id}`, activity);
  }

  deleteActivity(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
