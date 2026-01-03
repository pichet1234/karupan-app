import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {

  urlserver='http://localhost:3000';
  constructor(private http: HttpClient) { }
  /* เพิ่มประเภทครุภัณฑ์ */
  addkarupanType(data:any):Observable<any>{
    return this.http.post<any>(`${this.urlserver}/addkarupanType`,data);
  }
 /*รับครุภัณฑ์ประเภทบริจาค */
  addkarupanDonate(data:any):Observable<any>{
    return this.http.post<any>(`${this.urlserver}/addkarupanDonate`,data);
  }
  /* ดึงข้อมูลประเภทครุภัณฑ์ */
  getkarupanType():Observable<any>{
    return this.http.get<any>(`${this.urlserver}/getkarupan`);
  }
  /* ดึงข้อมูลครุภัณฑ์ที่สาท่ชารถยืมได้ */
 getkarupanborrow():Observable<any>{
    return this.http.get<any>(`${this.urlserver}/getkarupanborrow`);
  }

}
