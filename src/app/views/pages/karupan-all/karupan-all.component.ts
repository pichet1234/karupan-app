import { Component } from '@angular/core';
import { ApiDataService } from '../../../core/services/api-data.service';
import { CommonModule } from '@angular/common';
import { FeatherIconDirective } from '../../../core/feather-icon/feather-icon.directive';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';   

@Component({
  selector: 'app-karupan-all',
  standalone: true,
  imports: [
    CommonModule,
    FeatherIconDirective,
    NgbPaginationModule,
    FormsModule
  ],
  templateUrl: './karupan-all.component.html',
  styleUrl: './karupan-all.component.scss'
})
export class KarupanAllComponent {
  karupans:any[] = [];
  page = 1;                // หน้าปัจจุบัน
  pageSize = 5;            // จำนวนรายการต่อหน้า
  collectionSize = 0;      // จำนวนข้อมูลทั้งหมด

  pagedData: any[] = [];   // ข้อมูลที่ใช้แสดงจริง
  constructor( private apidataService: ApiDataService){}

  ngOnInit(): void{
    this.loadData();
  }
  loadData(){
    this.apidataService.getKarupanAll().subscribe({
      next: (res)=>{
        this.karupans = res.data;
        this.collectionSize = this.karupans.length;   // ⭐ สำคัญ
        this.refreshData();                            // ⭐ slice ข้อมูล
        console.log(this.karupans);
      },
      error: (err)=>{
        console.log(err);
      }
    });
  }

  refreshData() {
    this.pagedData = this.karupans.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }
}
