import { Component } from '@angular/core';
import { ApiDataService } from '../../../core/services/api-data.service';
import { CommonModule } from '@angular/common';
import { FeatherIconDirective } from '../../../core/feather-icon/feather-icon.directive';
import { NgbPaginationModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormsModule } from '@angular/forms';
import { ThaidatePipe } from '../../../core/pipes/thaidate.pipe';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AddressService, TambonData, MooData, VillageData } from '../../../core/services/address.service';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-regit-karupan-borrow',
  standalone: true,
  imports: [
    CommonModule,
    FeatherIconDirective,
    NgbPaginationModule,
    FormsModule,
    ThaidatePipe,
    ReactiveFormsModule,
    RouterLink
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
  viewData: any;
  karupanborrow: any[] = [];//เก็บข้อมูลครุภัณฑ์ที่สามารถยืมได้
  borrowid: any;

  tambons: string[] = [];
  moos: string[] = [];
  villages: any[] = [];

  modalRef: any;

  borrowForm!: FormGroup;

  karupansForBorrow!: FormGroup;
  constructor(
    private apidataService: ApiDataService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private addressService: AddressService,
  ) {
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
  ngOnInit(): void {
    this.tambons = this.addressService.getTambons();
    this.listenAddressChange();
    this.loadCounts();
    this.loaddataBorrow();
    this.loadkarupanborrow();
    this.karupansForBorrow = this.fb.group({
      items: this.fb.array([])
    });
  }
  loadkarupanborrow() {
    // ดึงข้อมูลครุภัณฑ์ที่สามารถยืมได้
    this.apidataService.getkarupanborrow().subscribe({
      next: (res) => {
        this.karupanborrow = res.data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  listenAddressChange() {

    this.borrowForm.get('tambon')?.valueChanges.subscribe(val => {

      this.villages = this.addressService.getVillagesByTambon(val);

      this.moos = this.villages.map(v => v.moo);

      this.borrowForm.patchValue({
        moo: '',
        village: ''
      }, { emitEvent: false });

    });

    this.borrowForm.get('moo')?.valueChanges.subscribe(val => {

      const village = this.villages.find(v => v.moo === val);

      if (village) {
        this.borrowForm.patchValue({
          village: village.village
        }, { emitEvent: false });
      }

    });

  }
  loadCounts() {
    this.apidataService.countStatusOne().subscribe({
      next: (res) => {
        this.borrowOne = res.count;
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.apidataService.countStatusTwo().subscribe({
      next: (res) => {
        this.borrowTwo = res.count;
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.apidataService.countBorrowAll().subscribe({
      next: (res) => {
        this.totalBorrow = res.count;
      },
      error: (err) => {

        console.log(err);
      }
    });
  }
  loaddataBorrow() {
    this.apidataService.getAllborrw().subscribe({
      next: (res) => {
        this.borrows = res.data
        this.collectionSize = this.borrows.length;

        this.refreshData();
        // console.log(this.borrows);
      }, error: (err) => {
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
  onViewDetails(borrow: any, i: any) {
    this.viewData = i;
    this.modalService.open(borrow, { size: 'lg' });
  }
  editBorrow(kborrow: any, i: any) {

    this.viewData = i;
    console.log(this.viewData)
    this.borrowForm.patchValue({
      _id: i._id,
      borrow_date: i.borrow_date ? new Date(i.borrow_date).toISOString().substring(0, 10) : '',
      return_date: i.return_date ? new Date(i.return_date).toISOString().substring(0, 10) : '',
      patient: i.patient,
      details: i.details,
      remark: i.remark,
      bannumber: i.address.bannumber,
      tambon: i.address.tambon
    });

    // โหลด villages
    this.villages = this.addressService.getVillagesByTambon(i.address.tambon);
    this.moos = this.villages.map(v => v.moo);

    // set moo + village
    this.borrowForm.patchValue({
      moo: i.address.moo,
      village: i.address.village
    });

    this.modalRef = this.modalService.open(kborrow, { size: 'lg' });
  }
  updateBorrow() {

    if (this.borrowForm.invalid) {
      console.log('แบบฟอร์มไม่ถูกต้อง');
    }
    const formValue = this.borrowForm.value;
    this.apidataService.editborrow(formValue).subscribe({
      next: (res) => {
        if (res) {
          Swal.fire({
            icon: 'success',
            title: res.message,
            showConfirmButton: false,
            timer: 1500
          });
          this.modalRef.close();
          this.loaddataBorrow();
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'อัพเดตข้อมูลไม่สำเร็จ',
          showConfirmButton: false,
          timer: 1500
        });
        console.error(err);
      }
    });

  }
  deleteBorrow(item: any) {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: "คุณจะไม่สามารถกู้คืนข้อมูลนี้ได้!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apidataService.removeborrow(item).subscribe({
          next: (res) => {
            if (res) {
              Swal.fire(
                'Deleted!',
                'ข้อมูลของคุณถูกลบแล้ว.',
                'success'
              );
              this.loaddataBorrow();
            }
          },
          error: (err) => {
            Swal.fire(
              'Error!',
              'เกิดข้อผิดพลาดในการลบข้อมูล.',
              'error'
            );
            console.error(err);
          }
        });
      }
    });
  }
  // เพิ่มครุภัณฑ์ทีการยืม
  viewKarupanBorrow(karaupforborw: any, i: any) {
    this.viewData = i;
    this.borrowid = i._id;
    this.modalRef = this.modalService.open(karaupforborw, { size: 'lg' });
  }
  // เลือกครุภัณฑ์ที่ต้องการยืมเพื่อเปิดฟอร์มยืม
  chooseButton(item: any, formadd: any, modal: any) {
    this.modalRef = this.modalService.open(formadd, { size: 'lg' });
    const form = this.fb.group({
      borrowid: [this.borrowid],
      karupanid: [item._id],
      kname: [item.kname],
      karupuncode: [item.karupanCode],
      statuskarupan: ['ยังไม่คืน'],
      diposit: [item.deposit || null, Validators.required],
      imageUrl: [item.imageUrl]
    });
    this.items.push(form);
    modal.close();
  }
  get items(): FormArray {
    return this.karupansForBorrow.get('items') as FormArray;
  }
submitBorrow() {
  const items = this.karupansForBorrow.value.items;
  // เช็ค deposit ว่ามีค่าว่างหรือไม่
  const invalidDeposit = items.some((item:any) =>
    item.deposit === null || item.deposit === ''
  );

  if (this.karupansForBorrow.valid && !invalidDeposit) {
    const borrowDetails = items;
    console.log(borrowDetails);

    // ส่ง API
     this.apidataService.addBorrowDetail({ items: borrowDetails }).subscribe({
       next: (res) => {
         Swal.fire({
           title: res.message,
           text: 'ข้อมูลถูกบันทึกเรียบร้อยแล้ว',
           icon: 'success',
           timer: 1500,
           showConfirmButton: false
         });

         this.karupansForBorrow.reset();
         this.modalService.dismissAll();
       },
       error: (err) => {
         Swal.fire({
           title: 'เกิดข้อผิดพลาด',
           text: err?.error?.message || 'ไม่สามารถบันทึกข้อมูลได้',
           icon: 'error'
         });
       }
     });

  } else {

    Swal.fire({
      title: 'โปรดตรวจสอบค่ามัดจำ',
      text: 'กรุณากรอกข้อมูลให้ครบถ้วนก่อนบันทึก',
      icon: 'warning'
    });

  }

}

}
