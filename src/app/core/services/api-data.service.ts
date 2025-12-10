import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {

  urlserver='http://localhost:3000';
  constructor(private http: HttpClient) { }

  addkarupanType(data:any):Observable<any>{
    return this.http.post<any>(`${this.urlserver}/addkarupanType`,data);
  }
}
