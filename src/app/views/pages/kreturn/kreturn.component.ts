import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiDataService } from '../../../core/services/api-data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
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
  reBorrowitem: any;
  idreborwDetl: any;

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
    rerurnBorrow(i: any){

      this.reBorrowitem = i;
      console.log('ID ที่ส่งคืน:', this.reBorrowitem);
      
      this.apidataService.returnBorrow(this.reBorrowitem).subscribe({
        next: (res) => {
          Swal.fire({
            title: res.message,
            text: 'คืนครุภัณฑ์เรียบร้อยแล้ว',
            icon: 'success',
            confirmButtonText: 'ตกลง'
          });

        },
        error: (err) => {
          Swal.fire({
            title: err.message,
            text: 'เกิดข้อผิดพลาดในการคืนครุภัณฑ์',
            icon: 'error',
            confirmButtonText: 'ตกลง'
          });
        }
      });
      
    }
    removeButton(item: any) {
      this.idreborwDetl = item;   // item = id หรือ object
      console.log(this.idreborwDetl);
    
      Swal.fire({
        title: 'ยืนยันการลบ?',
        text: 'ข้อมูลนี้จะไม่สามารถกู้คืนได้!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'ลบ',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {
        if (result.isConfirmed) {
          this.apidataService.removeBorwDetail(this.idreborwDetl).subscribe({
            next: (res) => {
              Swal.fire({
                title: res.message,
                text: 'ข้อมูลถูกลบเรียบร้อยแล้ว',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
                 });
                },
                error: (err) => {
                    Swal.fire({
                      title: 'เกิดข้อผิดพลาด',
                      text: err?.error?.message || 'ไม่สามารถลบข้อมูลได้',
                      icon: 'error'
                    });
                  }
                });
    
        }
      });
    }
    // แปลง status -> badge class
  getBadgeClass(status: string) {
    switch (status) {
      case 'คืนแล้ว': return 'badge rounded-pill bg-success';
      case 'ยังไม่คืน': return 'badge rounded-pill bg-warning text-dark';
      default: return 'badge rounded-pill bg-secondary';
    }
  }
}