import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ActService {
  constructor(private http: HttpClient) {}

  getAllActivities(type?: string) {
    if (type) {
      return this.http.get<any[]>('/api/activities', { params: { type } });
    }
    return this.http.get<any[]>('/api/activities');
  }
}