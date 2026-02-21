import { Component } from '@angular/core';
import { ApiDataService } from '../../../core/services/api-data.service';
import { CommonModule } from '@angular/common';
import { FeatherIconDirective } from '../../../core/feather-icon/feather-icon.directive';
import { NgbPaginationModule ,NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';   
import { ThaidatePipe } from '../../../core/pipes/thaidate.pipe';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-karupan-all',
  standalone: true,
  imports: [
    CommonModule,
    FeatherIconDirective,
    NgbPaginationModule,
    FormsModule,
    ThaidatePipe,
    ReactiveFormsModule
  ],
  templateUrl: './karupan-all.component.html',
  styleUrl: './karupan-all.component.scss'
})
export class KarupanAllComponent {
  totalKarupan = 0;
  totalKarupanSuccess = 0;
  totalKarupanDanger = 0;
  totalKarupanborrw = 0;

  karupans:any[] = [];
  page = 1;                // หน้าปัจจุบัน
  pageSize = 5;            // จำนวนรายการต่อหน้า
  collectionSize = 0;      // จำนวนข้อมูลทั้งหมด

  pagedData: any[] = [];   // ข้อมูลที่ใช้แสดงจริง
  viewData: any ;
  imgBase = 'http://localhost:3000/'; // เปลี่ยนตาม backend คุณ

  selectedFile: File | null = null;
  editForm!: FormGroup;

  searchText: string = '';
  filteredData: any[] = [];
  constructor( 
    private fb: FormBuilder,
    private apidataService: ApiDataService,
    private modalService: NgbModal
    ){}

  ngOnInit(): void{

      this.editForm = this.fb.group({
    karupanCode: ['', Validators.required],
    kname: ['', Validators.required],
    brand: [''],
    price: [0, Validators.required],
    expenditure: [''],
    station: [''],
    status: [''],
    usefullife: [''],
    redate: [''],
    detail: [''],
    imageUrl: ['']
  });

    this.loadData();
    this.loadCounts();
  }
  loadCounts(){
    this.apidataService.countKarupanAll().subscribe({
      next: (res)=>{
        this.totalKarupan = res.count;
      },
      error: (err)=>{
        console.log(err);
      }
    });
    this.apidataService.countkpStatusSuccess().subscribe({
      next: (res)=>{
        this.totalKarupanSuccess = res.result[0].total;
      },
      error: (err)=>{
        console.log(err);
      }
    });
    this.apidataService.countkarupandanger().subscribe({
      next: (res)=>{
        this.totalKarupanDanger = res.result[0].total;
      },
      error: (err)=>{
        console.log(err);
      }
    }); 
    this.apidataService.countkborrow().subscribe({
      next:(res)=>{
        this.totalKarupanborrw = res.result[0].total;
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }

  loadData(){
    this.apidataService.getKarupanAll().subscribe({
      next: (res)=>{
        this.karupans = res.data;
        this.filteredData = [...this.karupans];
        this.collectionSize = this.karupans.length;  
        this.refreshData();                            
        console.log(this.karupans);
      },
      error: (err)=>{
        console.log(err);
      }
    });
  }

  refreshData() {
    this.pagedData = this.filteredData.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }

  // แปลง status -> badge class
  getBadgeClass(status: string) {
    switch (status) {
      case 'ใช้งานได้': return 'badge rounded-pill bg-success';
      case 'ชำรุด': return 'badge rounded-pill bg-danger';
      case 'กำลังซ่อมบำรุง': return 'badge rounded-pill bg-warning text-dark';
      default: return 'badge rounded-pill bg-secondary';
    }
  }
  onSearch() {
  const keyword = this.searchText.toLowerCase().trim();

  if (!keyword) {
    this.filteredData = [...this.karupans];
  } else {
    this.filteredData = this.karupans.filter(k =>
      k.kname?.toLowerCase().includes(keyword) ||
      k.karupanCode?.toLowerCase().includes(keyword) ||
      k.karupanTypeInfo?.[0]?.karupanType?.toLowerCase().includes(keyword)
    );
  }

  this.page = 1; // reset page
  this.collectionSize = this.filteredData.length;
  this.refreshData();
}
  /**
   * 
   * View modal
   * 
   */
    onView(karupan: any, i: any) {
    this.viewData = i;
    this.modalService.open(karupan, {
      size: 'lg'
    });
    console.log(this.viewData);
  }
  //===================================end ส่วน view modal===================================
/**
 * Edit modal
 */
   editKarupan(karupan: any, i: any){
      this.viewData = i;
      this.editForm.patchValue({
        ...i,
        redate: i.redate? new Date(i.redate).toISOString().substring(0, 10) : ''
      });
      this.modalService.open(karupan, {
        size: 'lg'
      });
      console.log(this.viewData);
  }
  saveEdit() {
  if (this.editForm.invalid) return;
    const formData=new FormData();
   if (this.selectedFile) {
          formData.append('file', this.selectedFile);
        }
   const payload = {
    ...this.editForm.value,
    _id: this.viewData._id
  };
  this.apidataService.updateKarupan(payload, this.selectedFile!)
    .subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'บันทึกสำเร็จ',
          timer: 1500,
          showConfirmButton: false
        });

        this.modalService.dismissAll();

        this.loadData(); // reload list
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: err.error?.message || 'ไม่สามารถบันทึกได้'
        });
      }
    });
}
onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;
  }
}

//===================================end ส่วน edit modal===================================
/*
* Delete modal
*/
  deleteKarupan(karupan: any){
      this.viewData = karupan;
     
      Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: 'คุณต้องการลบข้อมูลนี้หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'ใช่, ลบเลย!',
        cancelButtonText: 'ไม่, ยกเลิก'
      }).then((result) => {
        if (result.isConfirmed) {
          this.apidataService.removeKarupan(this.viewData._id).subscribe({
            next: (res) => {
              Swal.fire({
                title: res.message,
                text: 'ข้อมูลถูกลบเรียบร้อยแล้ว',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
              });
              this.loadData(); // โหลดข้อมูลใหม่หลังลบ
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


}
