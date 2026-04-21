import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiDataService } from '../../../../core/services/api-data.service';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule ,FormsModule} from '@angular/forms';
import { FeatherIconDirective } from '../../../../core/feather-icon/feather-icon.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule,
            ReactiveFormsModule,
            FormsModule,
            FeatherIconDirective  
          ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  users: any[] = [];
  filteredUsers: any[] = [];

  searchText: string = '';
  modalRef: any;

  editUserForm: FormGroup;
  userForm: FormGroup;
  roles = ['admin', 'staff', 'viewer'];
  selectedFile: File | null = null;

  constructor(
    private modalService: NgbModal,
    private api:ApiDataService,
    private fb: FormBuilder
  ){
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required],
      tel: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      role: ['viewer', Validators.required] // กำหนด default value เป็น viewer
    });

    this.editUserForm = this.fb.group({
      id:[''],
      fullname: [''],
      email:[''],
      position: [''],
      tel:[''],
      role:['']
    });
  }
  ngOnInit(): void {
    this.getUser();
  }
  getUser(){
    this.api.getUser().subscribe({
       next: (res: any) => {
        this.users = res;
        this.filteredUsers = res; // เริ่มต้นแสดงทั้งหมด
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  selectUser(editUser: any, user: any){
    this.modalRef = this.modalService.open(editUser, { size: 'lg' });
    // กำหนดค่าเริ่มต้นให้กับฟอร์มแก้ไข
    this.editUserForm.patchValue({
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      position: user.position,
      tel: user.tel,
      role: user.role
    });
  }

  editUser(){
    const formData = new FormData();

    Object.keys(this.editUserForm.value).forEach(key =>{
      formData.append(key, this.editUserForm.value[key]);
    });

    formData.append('id', this.editUserForm.value.id);
    if (this.selectedFile) {
        formData.append('image', this.selectedFile);
    }
    this.api.updateUser(formData).subscribe({
      next: (res) =>{
        Swal.fire({
          icon: 'success',
          title: res.message || 'แก้ไขผู้ใช้สำเร็จ',
          showConfirmButton: false,
          timer: 1500
        });
        this.getUser(); // รีเฟรชข้อมูลผู้ใช้หลังแก้ไขสำเร็จ
        this.modalRef.close();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: err?.error?.message || 'ไม่สามารถแก้ไขผู้ใช้ได้'
        });
        this.modalRef.close();
      }
    })
  }
  onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;
  }
}
  deleteUser(data:any){
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ไม่, ยกเลิก'     
    }).then((result) =>{
      if (result.isConfirmed) {
        this.api.deleteUser(data).subscribe({
          next: (res) =>{
            Swal.fire({
              title: res.message,
              text: 'ข้อมูลถูกลบเรียบร้อยแล้ว',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false             
             });
             this.getUser();
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

  openAddUser(user: any){
    this.modalRef = this.modalService.open(user, { size: 'lg' });
  }
onSubmit(modal: any) {
    if (this.userForm.valid) {
      this.api.regiterUser(this.userForm.value).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: res.message || 'เพิ่มผู้ใช้สำเร็จ',
            showConfirmButton: false,
            timer: 1500
          });
          this.getUser(); // รีเฟรชข้อมูลผู้ใช้หลังเพิ่มสำเร็จ
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: err?.error?.message || 'ไม่สามารถเพิ่มผู้ใช้ได้'
          });
        }
      });
      modal.close(); // ปิด modal เมื่อสำเร็จ
      this.userForm.reset({ role: 'viewer' }); // ล้างค่าในฟอร์ม
    } else {
      // สั่งให้แสดง error ในกรณีที่กด submit แต่กรอกไม่ครบ
      this.userForm.markAllAsTouched();
    }
  }
    // Search Function
  onSearch() {
    const keyword = this.searchText.toLowerCase().trim();

    this.filteredUsers = this.users.filter(user =>
      user.fullname?.toLowerCase().includes(keyword) ||
      user.email?.toLowerCase().includes(keyword) ||
      user.position?.toLowerCase().includes(keyword) ||
      user.tel?.toLowerCase().includes(keyword) ||
      user.role?.toLowerCase().includes(keyword)
    );
  }
}
