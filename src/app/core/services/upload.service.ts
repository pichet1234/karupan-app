import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(private http: HttpClient) {}

  /**
   * Uploads a file to the server. Default endpoint: http://localhost:3000/upload
   * Returns Http events so component can track progress.
   */
  uploadFile(file: File, url: string = 'http://localhost:3000/upload'): Observable<HttpEvent<any>> {
    const fd = new FormData();
    fd.append('file', file, file.name);
    return this.http.post<any>(url, fd, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
