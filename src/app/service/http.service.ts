import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient, ) { }

  async get<T>(url: string): Promise<T> {
    const headers = await this.createAuthorizationHeader();
    return new Promise((resolve, reject) => {
      return this.httpClient
        .get<T>(url, { headers })
        .subscribe(
          (data: T) => {
            return resolve(data);
          },
          (errorResponse: HttpErrorResponse) => {
            return reject(errorResponse);
          }
        );
    });
  }

  async post<T>(url: string, data: any): Promise<T> {
    const headers = await this.createAuthorizationHeader();
    return new Promise((resolve, reject) => {
      return this.httpClient
        .post<T>(url, data, { headers })
        .subscribe(
          (response: T) => {
            return resolve(response);
          },
          (errorResponse: HttpErrorResponse) => {
            return reject(errorResponse);
          }
        );
    });
  }

  async delete<T>(url: string): Promise<T> {
    const headers = await this.createAuthorizationHeader();
    return new Promise((resolve, reject) => {
      return this.httpClient
        .delete<T>(url, { headers })
        .subscribe(
          (data: T) => {
            return resolve(data);
          },
          (errorResponse: HttpErrorResponse) => {
            return reject(errorResponse);
          }
        );
    });
  }

  async patch<T>(url: string, data: any): Promise<T> {
    const headers = await this.createAuthorizationHeader();
    return new Promise((resolve, reject) => 
    {
      this.httpClient
        .patch<T>(url, data, { headers })
        .subscribe(
          (response: T) => {
            return resolve(response);
          },
          (errorResponse: HttpErrorResponse) => {
            return reject(errorResponse);
          }
        );
    });
  }

  private async createAuthorizationHeader() :Promise<HttpHeaders>
  {
    let currentUser:any;
    currentUser= null;
    //currentUser = localStorage.getItem('currentuser')?JSON.parse(localStorage.getItem('currentuser') as string):null;
    if(currentUser)
    {
      const headers = new HttpHeaders(
      {
          Authorization: `Bearer ${currentUser.accessToken}`,
          username:currentUser.username
      });
      return headers;
    }
    else
      return new HttpHeaders();
  }

}
