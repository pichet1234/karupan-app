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
  totalKarupan = 0;
  totalKarupanSuccess = 0;
  totalKarupanDanger = 0;

  karupans:any[] = [];
  page = 1;                // หน้าปัจจุบัน
  pageSize = 5;            // จำนวนรายการต่อหน้า
  collectionSize = 0;      // จำนวนข้อมูลทั้งหมด

  pagedData: any[] = [];   // ข้อมูลที่ใช้แสดงจริง
  constructor( private apidataService: ApiDataService){}

  ngOnInit(): void{
    this.loadData();
    this.loadCounts();
  }
  loadCounts(){
    this.apidataService.countKarupanAll().subscribe({
      next: (res)=>{
        this.totalKarupan = res.count;
      },
      error: (err)=>{
        console.log(err);
      }
    });
    this.apidataService.countkpStatusSuccess().subscribe({
      next: (res)=>{
        this.totalKarupanSuccess = res.result[0].total;
      },
      error: (err)=>{
        console.log(err);
      }
    });
    this.apidataService.countkarupandanger().subscribe({
      next: (res)=>{
        this.totalKarupanDanger = res.result[0].total;
      },
      error: (err)=>{
        console.log(err);
      }
    }); 
  }

  loadData(){
    this.apidataService.getKarupanAll().subscribe({
      next: (res)=>{
        this.karupans = res.data;
        this.collectionSize = this.karupans.length;  
        this.refreshData();                            
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

  // แปลง status -> badge class
  getBadgeClass(status: string) {
    switch (status) {
      case 'ใช้งานได้': return 'badge bg-success';
      case 'ชำรุด': return 'badge bg-danger';
      case 'กำลังซ่อมบำรุง': return 'badge bg-warning text-dark';
      default: return 'badge bg-secondary';
    }
  }

}
