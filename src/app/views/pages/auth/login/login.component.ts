import { NgStyle,CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators , ReactiveFormsModule} from '@angular/forms';
import { ApiDataService } from '../../../../core/services/api-data.service';
import { AuthService } from '../../../../core/services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgStyle,
    RouterLink,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  returnUrl: string = '/';
  loginForm: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apidataservice:ApiDataService,
    private fb: FormBuilder,
    private authService: AuthService
    ) {
      this.loginForm = this.fb.group({
        username:[''],
        password:[''],
      });
    }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onLoggedin() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.apidataservice.loginUser(this.loginForm.value).subscribe({

      next: (res: any) => {
          console.log('Response:', res);
          console.log('Token:', res.token);
          // 💾 บันทึก token
          this.authService.saveTokens(res.accessToken, res.refreshToken);

          // 💾 บันทึก user
          localStorage.setItem('user', JSON.stringify(res.user));

          // 🔁 redirect
          this.router.navigateByUrl(this.returnUrl);

          this.loading = false;
      },

      error: (err) => {
        console.error(err);

        if (err.status === 401) {
          this.errorMessage = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
        } else {
          this.errorMessage = 'เกิดข้อผิดพลาดจากระบบ';
        }

        this.loading = false;
      }

    });
  }

}
