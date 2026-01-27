import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiDataService } from '../../../core/services/api-data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kreturn',
  standalone: true,
  imports: [
    NgbModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './kreturn.component.html',
  styleUrl: './kreturn.component.scss'
})
export class KreturnComponent {
  imgBase = 'http://localhost:3000/';   // หรือ domain จริง
  defaultImg = 'images/photos/img15.jpg';
  searchText: string = '';
  selectdata: any = null;
  borrows: any[] = [];
  searchPatients: any[] = [];
  searchList: any[] = [];
  constructor(
    private apidataService: ApiDataService
  ) {}

  ngOnInit(): void {
    this.loaddataBorrow();
  }

loaddataBorrow(){
  this.apidataService.getAllborrw().subscribe({
    next: (res)=>{
      this.borrows = res.data;

      // แปลงข้อมูลจาก lookup → สำหรับ search
      this.searchPatients = this.borrows.map((b:any) => ({
        fullName: b.patient,
        phone: b.person.phone,
        borrow_id: b._id,
        details: b.details,
        raw: b
      }));
    },
    error: (err)=>{
      console.log(err);
    }
  });
}
  // ฟังก์ชัน search ที่ ngbTypeahead ต้องการ: รับ observable ของ input และคืน observable ของ suggestions
search = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 1 ? []
      : this.searchPatients
          .filter(p =>
            p.fullName.toLowerCase().includes(term.toLowerCase()) ||
            (p.phone && p.phone.includes(term))
          )
          .slice(0, 10)
    )
  );

  // ถ้าต้องการแสดงผลใน input ต่างจากผลที่ถูกเลือก ให้ใช้ formatter
 formatter = (result: any) => result.fullName;

onClick(event:any){
  this.selectdata = event.item.raw;

  console.log('ข้อมูลเต็ม:', this.selectdata);
}

    getImage(item: any): string {

      // รูปจาก backend (uploads/xxx.jpg)
      if (item?.karupan?.imageUrl && item.karupan.imageUrl.trim() !== '') {
        return this.imgBase + item.karupan.imageUrl;
      }

      if (item?.imageUrl && item.imageUrl.trim() !== '') {
        return this.imgBase + item.imageUrl;
      }

      // default frontend
      return this.defaultImg;   // images/photos/img15.jpg
    }

}
