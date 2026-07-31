import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Subscriber } from '../models/subscriber';

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {

  private readonly API = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getSubscribers(): Observable<Subscriber[]> {

    return this.http.get<Subscriber[]>(`${this.API}/subscribers`);

  }

  registerSubscriber(subscriber: Subscriber): Observable<Subscriber> {

    return this.http.post<Subscriber>(
      `${this.API}/subscribe`,
      subscriber
    );

  }

  updateSubscriber(
    id: number,
    subscriber: Subscriber
  ): Observable<Subscriber> {

    return this.http.put<Subscriber>(
      `${this.API}/subscribers/${id}`,
      subscriber
    );

  }

  deleteSubscriber(id: number): Observable<void> {

    return this.http.delete<void>(
      `${this.API}/subscribers/${id}`
    );

  }

}