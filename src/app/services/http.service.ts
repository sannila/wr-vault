import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/model';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private baseURL = 'http://localhost:5000/api/';
  localStorage: any;
  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.localStorage = document.defaultView?.localStorage;
  }

  private createHeaders(): HttpHeaders {
    let headers: HttpHeaders = new HttpHeaders();

    headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });

    if (this.localStorage) {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        headers = headers.set('Authorization', 'Bearer ' + authToken);
      }
    }

    return headers;
  }

  // get request
  get(endPoint: string): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get<any>(this.baseURL + endPoint, { headers });
  }

  

  // post request
  post(endPoint: string, data: User): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post<any>(this.baseURL + endPoint, data, { headers });
  }

  // update request
  update(endPoint: string, data: User): Observable<any> {
    const headers = this.createHeaders();
    return this.http.put<any>(this.baseURL + endPoint, data, { headers });
  }

  // delete request
  delete(endPoint: string): Observable<any> {
    const headers = this.createHeaders();
    return this.http.delete<any>(this.baseURL + endPoint, { headers });
  }
}
