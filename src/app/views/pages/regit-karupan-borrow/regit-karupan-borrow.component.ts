import { Component } from '@angular/core';
import { ApiDataService } from '../../../core/services/api-data.service';
import { CommonModule } from '@angular/common';
import { FeatherIconDirective } from '../../../core/feather-icon/feather-icon.directive';
import { NgbPaginationModule ,NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms'; 
import { ThaidatePipe } from '../../../core/pipes/thaidate.pipe';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { AddressService ,TambonData, MooData } from '../../../core/services/address.service';

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

  tambons: TambonData[] = [];// ตำบล
  villages: MooData[] = [];// หมู่บ้าน
  moos: string[] = []; // หมู่ที่

  borrowForm!: FormGroup;
  constructor(
  private apidataService: ApiDataService,
  private modalService: NgbModal,
  private fb: FormBuilder,
  private addressService: AddressService
 ){
      this.borrowForm = this.fb.group({
      _id: [''],
      borrow_date: ['', Validators.required],
      return_date: [''],
      patient: ['', Validators.required],
      details: [''],
      remark: [''],
      bannumber: [''],
      moo: [''],
      village: [''],
      tambon: ['']
    });
 }
 ngOnInit(): void{

  this.tambons = this.addressService.getTambons();
  
  this.borrowForm.get('tambon')?.valueChanges.subscribe(val => {
    this.villages = this.addressService.getVillagesByTambon(val);
    this.borrowForm.get('village')?.setValue('');
    this.moos = [];
    this.borrowForm.get('moo')?.setValue('');
  });

this.borrowForm.get('village')?.valueChanges.subscribe(val => {
      const tambon = this.borrowForm.get('tambon')?.value;
  this.moos = this.addressService.getMooByVillageId(tambon, val);
  this.borrowForm.get('moo')?.setValue('');
});

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
      borrow_date: i.borrow_date ? new Date(i.borrow_date).toISOString().substring(0, 10) : '',
      return_date: i.return_date ? new Date(i.return_date).toISOString().substring(0, 10) : '',
      bannumber: i.address.bannumber || '',
      villages: i.address.village || '',
      moo: i.address.moo || '',
      tambon: i.address.tambon || '',
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
