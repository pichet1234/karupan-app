import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiDataService } from '../../../core/services/api-data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-kreturn',
  standalone: true,
  imports: [
    NgbModule,
    FormsModule
  ],
  templateUrl: './kreturn.component.html',
  styleUrl: './kreturn.component.scss'
})
export class KreturnComponent {
  private names = ['pichet', 'jirapan', 'sarosa', 'Blueberry', 'Cherry', 'Coconut', 'Grape', 'Grapefruit', 'Kiwi', 'Mango', 'Melon', 'Orange', 'Papaya', 'Pineapple', 'Strawberry'];
  selectdata: string | null = null;
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
      this.searchList = this.borrows.map((b:any) => ({
        fullName: `${b.person.fname} ${b.person.lname}`,
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
      : this.searchList
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
  this.selectdata = event.item.fullName;

  console.log('borrow_id:', event.item.borrow_id);
  console.log('details:', event.item.details);
  console.log('ข้อมูลเต็ม:', event.item.raw);
}
}
