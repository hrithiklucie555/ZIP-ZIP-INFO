import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Newsletter } from '../models/newsletter';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {

  private readonly API = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getNewsletters(): Observable<Newsletter[]> {

    return this.http.get<Newsletter[]>(`${this.API}/newsletters`);

  }

  publishNewsletter(newsletter: Newsletter): Observable<Newsletter> {

    return this.http.post<Newsletter>(
      `${this.API}/newsletters`,
      newsletter
    );

  }

  updateNewsletter(
    id: number,
    newsletter: Newsletter
  ): Observable<Newsletter> {

    return this.http.put<Newsletter>(
      `${this.API}/newsletters/${id}`,
      newsletter
    );

  }

  deleteNewsletter(id: number): Observable<void> {

    return this.http.delete<void>(
      `${this.API}/newsletters/${id}`
    );

  }

}