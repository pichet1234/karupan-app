import { Component } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { UploadService } from '../../../../core/services/upload.service';
import { NgbModal,NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiDataService } from '../../../../core/services/api-data.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-karupan',
  standalone: true,
  imports: [
    CommonModule,
    JsonPipe,
    NgbModalModule,
    ReactiveFormsModule
  ],
  templateUrl: './karupan.component.html',
  styleUrl: './karupan.component.scss'
})
export class KarupanComponent {
 selectedFile?: File | null = null;
  previewUrl?: string | ArrayBuffer | null = null;
  uploadProgress = 0;
  uploadResponse: any = null;
  karupanForm:any //สร้างตัวแปรเก็บฟอร์ม
  modalRef: any;
  constructor(
    private uploadService: UploadService,
    private modalService: NgbModal,
    private apiDataService:ApiDataService,
    private fb:FormBuilder) {
      this.karupanForm = this.fb.group({
        karupanType: ['', Validators.required],//ประเภทครุภัณฑ์
        details: ['']//รายละเอียด
      });
    }

   karupanModal(karupanType:any) {
    this.modalRef = this.modalService.open(karupanType, {
    centered: true,
    size: 'lg'
  });

  }

  summitForm(){
    this.apiDataService.addkarupanType(this.karupanForm.value).subscribe({
      next:(res:any)=>{
        if(res){
          Swal.fire({
            icon: 'success',
            title: res.message,
            showConfirmButton: false,
            timer: 1500
          });
          this.modalRef.close();
        }else{
          Swal.fire({ 
            icon: 'error',
            title: res.message,
            showConfirmButton: false,
            timer: 1500
          });
        }
      },
      error:(err:any)=>{
        console.log(err);
      }
    });
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.selectedFile = null;
      this.previewUrl = null;
      return;
    }

    this.selectedFile = input.files[0];

    // if image, generate preview
    if (this.selectedFile && this.selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.previewUrl = null;
    }
  }

  isImage(): boolean {
    return !!(this.selectedFile && this.selectedFile.type.startsWith('image/'));
  }

  upload() {
    if (!this.selectedFile) return;
    this.uploadProgress = 0;
    this.uploadResponse = null;

    this.uploadService.uploadFile(this.selectedFile).subscribe({
      next: (ev: any) => {
        // support either progress events or final response
        if (ev && ev.type === 1 && ev.total) {
          // HttpEventType.UploadProgress === 1
          this.uploadProgress = Math.round(100 * ev.loaded / ev.total);
        } else if (ev && ev.body) {
          this.uploadResponse = ev.body;
          this.uploadProgress = 100;
        } else {
          // fallback
          this.uploadResponse = ev;
        }
      },
      error: (err) => {
        console.error('Upload failed', err);
        this.uploadResponse = { error: true, message: err?.message || err };
      }
    });
  }
}
