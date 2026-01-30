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
  addPersonnel(data:any):Observable<any>{
    return this.http.post<any>(`${this.urlserver}/addPersonnel`,data);
  }
  addBorrow(data:any):Observable<any>{
    return this.http.post<any>(`${this.urlserver}/addborrow`,data);
  }
  addBorrowDetail(data:any):Observable<any>{
    return this.http.post<any>(`${this.urlserver}/borrowdetails`,data);
  }
  /* ดึงข้อมูล karupan ทั้งหมด*/
  getKarupanAll():Observable<any>{
    return this.http.get<any>(`${this.urlserver}/getkarupanall`);
  }
  countKarupanAll():Observable<any>{
    return this.http.get<any>(`${this.urlserver}/countkarupanall`);
  }
  countkpStatusSuccess():Observable<any>{
    return this.http.get<any>(`${this.urlserver}/countkarupanstatus`);
  }
  countkarupandanger():Observable<any>{
    return this.http.get<any>(`${this.urlserver}/countkarupandanger`);
  }
  getAllborrw():Observable<any>{
    return this.http.get<any>(`${this.urlserver}/getallborrows`);
  }
  returnBorrow(data:any):Observable<any>{
    return this.http.post<any>(`${this.urlserver}/returnborrow`,data);
  }
  removeBorwDetail(data:any):Observable<any>{
    return this.http.delete<any>(`${this.urlserver}/removeborwd/${data}`);
  }
}
