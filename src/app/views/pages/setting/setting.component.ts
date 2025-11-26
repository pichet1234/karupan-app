import { Component } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { UploadService } from '../../../core/services/upload.service';

// Note: this component is standalone in this project pattern. We import CommonModule
// so template directives like *ngIf work.

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [CommonModule, JsonPipe],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss'
})
export class SettingComponent {
  selectedFile?: File | null = null;
  previewUrl?: string | ArrayBuffer | null = null;
  uploadProgress = 0;
  uploadResponse: any = null;

  constructor(private uploadService: UploadService) {}

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
