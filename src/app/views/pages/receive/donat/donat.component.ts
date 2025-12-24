import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { UploadService } from '../../../../core/services/upload.service';
import { ApiDataService } from '../../../../core/services/api-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-donat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbDatepickerModule,
    ReactiveFormsModule
  ],
  templateUrl: './donat.component.html',
  styleUrl: './donat.component.scss'
})
export class DonatComponent {
  selectedDate: NgbDateStruct;
    karupanTypes: any[] = [];
    form:FormGroup;
    selectedFile:File | null = null;
    constructor(
          private fb:FormBuilder ,
          private uploadService:UploadService ,
          private apiDataService:ApiDataService
    ){
          this.form=fb.group({ 
                uname: ['',Validators.required],//ผู้บริจาค
                address: [''],
                tel: [''],
                kname: ['',Validators.required],//ชื่อครุภัณฑ์
                karupanCode: ['',Validators.required],//รหัสครุภัณฑ์
                redate:['',Validators.required],//วันที่รับเข้า
                karupantype: ['',Validators.required],//ประเภทครุภัณฑ์
                detail: ['',Validators.required],//รายละเอียด
                price: [0,Validators.required],//ราคา
                station: ['รพ.สต.บ้านเพียแก้ว'],//สถานที่ตั้ง
                expenditure: ['',Validators.required],//งบประมาณ
                usefullife: ['',Validators.required],//อายุการใช้งาน
                status: ['ใช้งานได้'],//สถานะ
                brand: [''],//ยี่ห้อ
          })
    }
    ngOnInit(): void {
      this.loadKarupanType();
    }
  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;
      console.log("📁 เลือกไฟล์แล้ว:", file.name);
    } else {
      this.selectedFile = null;
      console.warn("⚠ ยังไม่ได้เลือกไฟล์");
    }
  
  
  }
  loadKarupanType() {
    this.apiDataService.getkarupanType().subscribe({
      next: (res) => {
        console.log(res.data);
        this.karupanTypes = res.data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
