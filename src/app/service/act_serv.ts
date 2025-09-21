import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

// --- Interfaces ---
export interface Activity {
  id: number;
  name: string;
  type: string;
  suggested?: boolean;
  points?: number;
}

export interface ActivityLog {
  id: number;
  activityId: number;
  date: string;
  points: number;
  activityName?: string;
}

export interface Streak {
  type: string;
  currentStreak: number;
  longestStreak: number;
}

export interface DailyPoints {
  date: string;
  points: number;
}

@Injectable({ providedIn: 'root' })
export class ActService {
  private readonly baseUrl = 'http://localhost:8081/api/activities';
  private readonly logUrl = 'http://localhost:8081/api/logs';
  private readonly streakUrl = 'http://localhost:8081/api/streaks';
  private readonly dashboardUrl = 'http://localhost:8081/api/dashboard';

  constructor(private http: HttpClient) {}

  // --- Activities CRUD ---
  getAllActivities(type?: string): Observable<Activity[]> {
    let params = new HttpParams();
    if (type) {
      params = params.set('type', type);
    }
    return this.http.get<Activity[]>(this.baseUrl, { params }).pipe(
      catchError(err => {
        console.error('Error fetching activities:', err);
        return of([]);
      })
    );
  }

  createActivity(activity: Partial<Activity>): Observable<Activity> {
    return this.http.post<Activity>(this.baseUrl, activity).pipe(
      catchError(err => {
        console.error('Error creating activity:', err);
        return of(activity as Activity);
      })
    );
  }

  updateActivity(id: number, activity: Partial<Activity>): Observable<Activity> {
    return this.http.put<Activity>(`${this.baseUrl}/${id}`, activity).pipe(
      catchError(err => {
        console.error('Error updating activity:', err);
        return of(activity as Activity);
      })
    );
  }

  deleteActivity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(err => {
        console.error('Error deleting activity:', err);
        return of();
      })
    );
  }

  // --- Activity Logs (checkbox handling) ---
  markDone(activityId: number): Observable<ActivityLog> {
    return this.http.post<ActivityLog>(this.logUrl, { activityId }).pipe(
      tap(() => this.triggerActivityUpdate()),
      catchError(err => {
        console.error('Error marking activity done:', err);
        return of({ id: 0, activityId, date: '', points: 0 } as ActivityLog);
      })
    );
  }

  unmarkDone(activityId: number): Observable<void> {
    return this.http.delete<void>(`${this.logUrl}/${activityId}`).pipe(
      tap(() => this.triggerActivityUpdate()),
      catchError(err => {
        console.error('Error unmarking activity:', err);
        return of();
      })
    );
  }

  getLogs(range: 'today' | 'all' = 'today', type?: string): Observable<ActivityLog[]> {
  let params = new HttpParams()
    .set('range', range); // tell backend which logs to fetch

  if (type && type !== 'ALL') {
    params = params.set('type', type); // optional type filter
  }

  return this.http.get<ActivityLog[]>(`${this.logUrl}`, { params }).pipe(
    catchError(err => {
      console.error(`Error fetching ${range} logs:`, err);
      return of([]); // fallback to empty array
    })
  );
}



  // --- Streaks ---
  getAllStreaks(): Observable<Streak[]> {
    return this.http.get<Record<string, Streak>>(this.streakUrl).pipe(
      map(response =>
        Object.entries(response).map(([type, streak]) => {
          const { type: _type, ...rest } = streak;
          return { type, ...rest };
        })
      ),
      catchError(err => {
        console.error('Error fetching streaks:', err);
        return of([]);
      })
    );
  }

  getStreakByType(type: string): Observable<Streak> {
    return this.http.get<Streak>(`${this.streakUrl}/${type}`).pipe(
      catchError(err => {
        console.error(`Error fetching streak for type ${type}:`, err);
        return of({ type, currentStreak: 0, longestStreak: 0 } as Streak);
      })
    );
  }

  // --- Daily Points ---
  getTodayPoints(): Observable<number> {
    return this.http.get<number>(`${this.dashboardUrl}/points/today`).pipe(
      catchError(err => {
        console.error('Error fetching today points:', err);
        return of(0);
      })
    );
  }

getDailyPointsHistory(): Observable<DailyPoints[]> {
  return this.http.get<DailyPoints[]>(`${this.dashboardUrl}/daily-points`).pipe(
    catchError(err => {
      console.error('Error fetching daily points history:', err);
      return of([]); // fallback to empty array
    })
  );
}


  // --- Helper ---
  private triggerActivityUpdate(): void {
    window.dispatchEvent(new CustomEvent('activity-updated'));
  }
}
