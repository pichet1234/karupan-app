import { Component ,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerModule, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadfileService } from '../../../core/services/uploadfile.service';
import { ApiDataService } from '../../../core/services/api-data.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-receive',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbDatepickerModule,
    ReactiveFormsModule
    
],

  templateUrl: './receive.component.html',
  styleUrl: './receive.component.scss'
})
export class ReceiveComponent {

  selectedDate: NgbDateStruct| null = null;
  karupanTypes: any[] = [];
  form:FormGroup;
  selectedFile:File | null = null;
  constructor(
        fb:FormBuilder ,
        private uploadfileService:UploadfileService ,
        private apiDataService:ApiDataService,
        private modalService:NgbModal,){
    this.form=fb.group({ 
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

// -----------------------------------------
// ✔ ตรวจสอบไฟล์ว่าเลือกสำเร็จหรือยัง
// -----------------------------------------
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
        this.karupanTypes = res.data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
    onSubmit(){

        const date = this.form.get('redate')?.value; 
        const dateStr = `${date.year}-${date.month}-${date.day}`;
        const formData=new FormData();
        formData.append('kname',this.form.get('kname')?.value);
        formData.append('karupanCode',this.form.get('karupanCode')?.value);
        formData.append('karupantype',this.form.get('karupantype')?.value);
        formData.append('detail',this.form.get('detail')?.value);
        formData.append('price',this.form.get('price')?.value);
        formData.append('station',this.form.get('station')?.value);
        formData.append('expenditure',this.form.get('expenditure')?.value);
        formData.append('usefullife',this.form.get('usefullife')?.value);
        formData.append('status',this.form.get('status')?.value);
        formData.append('brand',this.form.get('brand')?.value);
        formData.append('redate', dateStr);
        
        if (this.selectedFile) {
          formData.append('image', this.selectedFile);
        }

       this.uploadfileService.uploadfile(formData).subscribe({
          next:(response:any)=>{
            if(response){
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
          error:(error)=>{
            console.error('Error uploading file:',error);
          }
        });

    }


}
