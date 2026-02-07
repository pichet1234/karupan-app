import { Component } from '@angular/core';
import { ApiDataService } from '../../../core/services/api-data.service';
import { CommonModule } from '@angular/common';
import { FeatherIconDirective } from '../../../core/feather-icon/feather-icon.directive';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms'; 
import { ThaidatePipe } from '../../../core/pipes/thaidate.pipe';

@Component({
  selector: 'app-regit-karupan-borrow',
  standalone: true,
  imports: [
    CommonModule,
    FeatherIconDirective,
    NgbPaginationModule,
    FormsModule,
    ThaidatePipe
  ],
  templateUrl: './regit-karupan-borrow.component.html',
  styleUrl: './regit-karupan-borrow.component.scss'
})
export class RegitKarupanBorrowComponent {
  borrows: any[] = [];
  page = 1;                // หน้าปัจจุบัน
  pageSize = 5;            // จำนวนรายการต่อหน้า
  collectionSize = 0;      // จำนวนข้อมูลทั้งหมด

  pagedData: any[] = [];   // ข้อมูลที่ใช้แสดงจริง
  borrowOne = 0;
  borrowTwo = 0;
  totalBorrow = 0;

  constructor(
  private apidataService: ApiDataService
 ){}
 ngOnInit(): void{
  this.loadCounts();
 this.loaddataBorrow();
 }
 loadCounts(){
  this.apidataService.countStatusOne().subscribe({
    next: (res)=>{
      this.borrowOne = res.count;
    },
    error: (err)=>{
      console.log(err);
    }
  });
  this.apidataService.countStatusTwo().subscribe({
    next: (res)=>{
      this.borrowTwo = res.count;
    },
    error: (err)=>{
      console.log(err);
    }
  });
  this.apidataService.countBorrowAll().subscribe({
    next: (res)=>{
      this.totalBorrow = res.count;
    },
    error: (err)=>{

      console.log(err);
    }
  });
 }
 loaddataBorrow(){
  this.apidataService.getAllborrw().subscribe({
    next:(res)=>{
      this.borrows = res.data
      this.collectionSize = this.borrows.length;
      this.refreshData();
      console.log(this.borrows);
    },error:(err) => {
      console.log(err);
    }
  });
 }
 refreshData() {
  this.pagedData = this.borrows.slice(
    (this.page - 1) * this.pageSize,
    (this.page - 1) * this.pageSize + this.pageSize
  );
}

  // แปลง status -> badge class
  getBadgeClass(status: string) {
    switch (status) {
      case 'คืนสำเร็จ': return 'badge rounded-pill bg-success';
      case 'ยังไม่คืน': return 'badge rounded-pill bg-danger';
      default: return 'badge rounded-pill bg-secondary';
    }
  }
}
