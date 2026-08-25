import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { Newsletter } from '../models/newsletter';


@Injectable({
  providedIn: 'root'
})
export class NewsletterService {

  private readonly API =
    'http://localhost:3000';


  constructor(
    private http: HttpClient
  ) {}


  // ==========================================
  // GET ALL NEWSLETTERS
  // ==========================================

  getNewsletters(): Observable<Newsletter[]> {

    return this.http.get<Newsletter[]>(
      `${this.API}/newsletters`
    );

  }


  // ==========================================
  // CREATE / PUBLISH NEWSLETTER
  // ==========================================

  publishNewsletter(
    newsletter: Newsletter
  ): Observable<Newsletter> {

    return this.http.post<Newsletter>(
      `${this.API}/newsletters`,
      newsletter
    );

  }


  // ==========================================
  // UPDATE NEWSLETTER
  // ==========================================

  updateNewsletter(
    id: number,
    newsletter: Newsletter
  ): Observable<Newsletter> {

    return this.http.put<Newsletter>(
      `${this.API}/newsletters/${id}`,
      newsletter
    );

  }


  // ==========================================
  // ADMIN - APPROVE NEWSLETTER
  // Pending → Published
  // ==========================================

  approveNewsletter(
    id: number
  ): Observable<any> {

    const token =
      localStorage.getItem('token');


    const headers =
      new HttpHeaders({
        Authorization: `Bearer ${token}`
      });


    console.log(
      'Sending approval request for newsletter:',
      id
    );


    return this.http.put<any>(
      `${this.API}/admin/newsletters/${id}/approve`,
      {},
      {
        headers
      }
    );

  }


  // ==========================================
  // ADMIN - REJECT NEWSLETTER
  // Pending → Rejected
  // ==========================================

  rejectNewsletter(
    id: number
  ): Observable<any> {

    const token =
      localStorage.getItem('token');


    const headers =
      new HttpHeaders({
        Authorization: `Bearer ${token}`
      });


    console.log(
      'Sending rejection request for newsletter:',
      id
    );


    return this.http.post<any>(
      `${this.API}/admin/newsletters/${id}/reject`,
      {},
      {
        headers
      }
    );

  }


  // ==========================================
  // DELETE NEWSLETTER
  // ==========================================

  deleteNewsletter(
    id: number
  ): Observable<void> {

    const token =
      localStorage.getItem('token');


    const headers =
      new HttpHeaders({
        Authorization: `Bearer ${token}`
      });


    return this.http.delete<void>(
      `${this.API}/newsletters/${id}`,
      {
        headers
      }
    );

  }

}