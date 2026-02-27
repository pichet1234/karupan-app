import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators , ReactiveFormsModule} from '@angular/forms';
import { ApiDataService } from '../../../../core/services/api-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NgStyle,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  constructor(private router: Router,
              private fb: FormBuilder,
              private apiservice: ApiDataService) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: [''],
      tel: ['', Validators.pattern('^[0-9]*$')],
      role: ['user'] // กำหนด default value
    });
  }

  ngOnInit(): void {}

  onRegister(event: Event) {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้าจอ

    if (this.registerForm.valid) {
      const payload = this.registerForm.value;
      console.log('Sending data:', payload);
      // ส่งไปยัง Backend
      this.apiservice.regiterUser(payload).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'ลงทะเบียนสำเร็จ',
              showConfirmButton: false,
              timer: 1500
            });
          },
          error: (err) => console.error('Error:', err)
        });
    } else {
      alert('Please fill all required fields correctly.');
    }
  }

}
