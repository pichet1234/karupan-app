import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Karupan } from '../../views/models/karupan.model';

@Injectable({
  providedIn: 'root'
})
export class UploadfileService {

  private apiurl = 'http://localhost:3000/uploadfile';
  constructor(private http: HttpClient) { }

  //function to upload file

  uploadfile(formData: FormData ): Observable<any> {
    return this.http.post<any>(this.apiurl, formData);
  }
}
