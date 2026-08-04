import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  private readonly API = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Get all tickets
  getTickets(): Observable<any[]> {

    return this.http.get<any[]>(`${this.API}/tickets`);

  }

  // Create ticket
  createTicket(ticket: any): Observable<any> {

    return this.http.post(

      `${this.API}/tickets`,

      ticket

    );

  }

  // Update ticket
  updateTicket(id: number, ticket: any): Observable<any> {

    return this.http.put(

      `${this.API}/tickets/${id}`,

      ticket

    );

  }

  // Delete ticket
  deleteTicket(id: number): Observable<any> {

    return this.http.delete(

      `${this.API}/tickets/${id}`

    );

  }

}