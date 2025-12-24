import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { UploadfileService } from '../../../../core/services/uploadfile.service';
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
    selectedDate: NgbDateStruct| null = null;
    karupanTypes: any[] = [];
    form:FormGroup;
    selectedFile:File | null = null;
    constructor(
          private fb:FormBuilder ,
          private uploadService:UploadfileService ,
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
                expenditure: ['บริจาค'],
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
  onSubmit() {
    if (this.selectedFile){
      const date = this.form.get('redate')?.value;
      const dateStr = `${date.year}-${date.month}-${date.day}`;
      const formData=new FormData();
      formData.append('uname', this.form.get('uname')?.value);
      formData.append('address', this.form.get('address')?.value);
      formData.append('tel', this.form.get('tel')?.value);
      formData.append('kname', this.form.get('kname')?.value);
      formData.append('karupanCode', this.form.get('karupanCode')?.value);
      formData.append('redate', dateStr);
      formData.append('karupantype', this.form.get('karupantype')?.value);
      formData.append('detail', this.form.get('detail')?.value);
      formData.append('price', this.form.get('price')?.value);
      formData.append('station', this.form.get('station')?.value);
      formData.append('expenditure', 'บริจาค');
      formData.append('usefullife', this.form.get('usefullife')?.value);
      formData.append('status', 'ใช้งานได้');
      formData.append('brand', this.form.get('brand')?.value);
      formData.append('file', this.selectedFile);
      
      this.uploadService.uploadfiledonate(formData).subscribe({
        next: (res:any) => {
            if(res){
              Swal.fire({
                icon: 'success',
                title: 'บันทึกข้อมูลสำเร็จ',
                showConfirmButton: false,
                timer: 1500
               });
            }else{
              Swal.fire({
                icon: 'error',
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                showConfirmButton: false,
                timer: 1500
                });
            }          
         },
        error: (err:any) => { console.error(err); }
      });
    }
  }
}
