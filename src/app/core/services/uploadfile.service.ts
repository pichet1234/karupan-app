import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Karupan } from '../../views/models/karupan.model';

@Injectable({
  providedIn: 'root'
})
export class UploadfileService {

  constructor(private http: HttpClient) { }

  //function to upload file
  //uploadfile(file: File ): Observable<any> {
  
  //}
}
