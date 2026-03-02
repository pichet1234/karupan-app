import { Component } from '@angular/core';
import { ApiDataService } from '../../../core/services/api-data.service';
import { CommonModule } from '@angular/common';
import { FeatherIconDirective } from '../../../core/feather-icon/feather-icon.directive';
import { NgbPaginationModule ,NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms'; 
import { ThaidatePipe } from '../../../core/pipes/thaidate.pipe';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-regit-karupan-borrow',
  standalone: true,
  imports: [
    CommonModule,
    FeatherIconDirective,
    NgbPaginationModule,
    FormsModule,
    ThaidatePipe,
    ReactiveFormsModule
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
  viewData: any ;
  borrowForm!: FormGroup;
  constructor(
  private apidataService: ApiDataService,
  private modalService: NgbModal,
  private fb: FormBuilder,
 ){
      this.borrowForm = this.fb.group({
      _id: [''],
      borrow_date: ['', Validators.required],
      return_date: [''],
      patient: ['', Validators.required],
      countn: [1, Validators.required],
      expenses: [0],
      statusborrow: ['borrowing'],
      details: [''],
      remark: [''],

      address: this.fb.group({
        bannumber: [''],
        moo: [''],
        village: [''],
        tambon: ['']
      })
    });
 }
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
      // console.log(this.borrows);
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

      getTotalDeducted(financelog: any[]): number {
      if (!financelog) return 0;
      return financelog.reduce((sum, f) => sum + (f.deductedAmount || 0), 0);
    }
      /**
   * 
   * View modal details
   * 
   */
    onViewDetails(borrow: any, i:any) {
      this.viewData = i;
      this.modalService.open(borrow, { size: 'lg' });
    }
    editBorrow(kborrow: any, i:any) {
      this.viewData = i;
      console.log('Edit Borrow:', this.viewData);
          this.borrowForm.patchValue({
      ...i,
      address: {
        bannumber: i.address?.bannumber || '',
        moo: i.address?.moo || '',
        village: i.address?.village || '',
        tambon: i.address?.tambon || ''
      }
    });
      this.modalService.open(kborrow, { size: 'lg' });
    }
     updateBorrow(modal: any) {

    if (this.borrowForm.invalid) {
      this.borrowForm.markAllAsTouched();
      return;
    }
    
  }
}
