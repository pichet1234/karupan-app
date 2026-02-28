import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiDataService } from '../../../../core/services/api-data.service';
import { ReactiveFormsModule ,FormsModule} from '@angular/forms';
import { FeatherIconDirective } from '../../../../core/feather-icon/feather-icon.directive';

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
  constructor(
    private api:ApiDataService,
  ){}
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
  editUser(data:any){
  }
  deleteUser(data:any){
  }
  openAddUser(){

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
