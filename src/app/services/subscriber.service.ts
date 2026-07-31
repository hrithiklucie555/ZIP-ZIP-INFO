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

  // Get all subscribers
  getSubscribers(): Observable<any[]> {

    return this.http.get<any[]>(`${this.API}/subscribers`);

  }

  // Register a new subscriber
  registerSubscriber(subscriber: any): Observable<any> {

    return this.http.post(
      `${this.API}/subscribe`,
      subscriber
    );

  }

  // Delete subscriber
  deleteSubscriber(id: number): Observable<any> {

    return this.http.delete(
      `${this.API}/subscribers/${id}`
    );

  }

  // Update subscriber
  updateSubscriber(id: number, subscriber: any): Observable<any> {

    return this.http.put(
      `${this.API}/subscribers/${id}`,
      subscriber
    );

  }
  importSubscribers(subscribers: any[]): Observable<any> {

  return this.http.post<any>(
    `${this.API}/subscribers/import`,
    subscribers
  );

}

}