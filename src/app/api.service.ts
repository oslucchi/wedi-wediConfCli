import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  
  private SERVER_BASE_URL: String;
  
  constructor(private httpClient: HttpClient, private storage: StorageService) {
    this.SERVER_BASE_URL = this.storage.host;
    this.SERVER_BASE_URL += this.storage.baseURL +  "/restcall";
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log("In handle error " + error.status);
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
  
  public get(endPoint: string){ 
    let url = this.SERVER_BASE_URL + '/' + endPoint;
    console.log("trying to get the page: " + url);
		return this.httpClient.get(url,  { 
                                headers: new HttpHeaders()
                                  .set('Content-Type', 'application/json')
                                  .set('Language', 'IT-it'),
                                observe: "response"
                          })
                          .pipe(
                            catchError(this.handleError)
                          );
	}  

	public post(endPoint: string, body: object){ 
    let url = this.SERVER_BASE_URL + '/' + endPoint;
    console.log("trying to post the page: " + url);

    return this.httpClient.post(url, body, 
                                { 
                                  headers: new HttpHeaders()
                                    .set('Content-Type', 'application/json')
                                    .set('Language', 'IT-it'),
                                  observe: "response"
                                })
                          .pipe(
                                  catchError(this.handleError)
                                );  
	}  

  public downloadFromURL(endPoint: string, body: object, rType: any): Observable<any>
 { 
    let url = this.SERVER_BASE_URL + '/' + endPoint;
    console.log("trying to download: " + url);

    return this.httpClient.post(url, body, 
                                { 
                                  headers: new HttpHeaders()
                                    .set('Content-Type', 'application/json')
                                    .set('Language', 'IT-it'),
                                  responseType: rType,
                                  observe: "response"
                                })
                          .pipe(
                                  catchError(this.handleError)
                                );  
  }
}