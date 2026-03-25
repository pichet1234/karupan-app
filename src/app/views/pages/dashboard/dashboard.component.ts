import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct, NgbDropdownModule  } from '@ng-bootstrap/ng-bootstrap';
import { ApexOptions, NgApexchartsModule } from "ng-apexcharts";
import { FeatherIconDirective } from '../../../core/feather-icon/feather-icon.directive';
import { ThemeCssVariableService, ThemeCssVariablesType } from '../../../core/services/theme-css-variable.service';
import { ApiDataService } from '../../../core/services/api-data.service';
import { CurrencyPipe,NgClass ,CommonModule  } from '@angular/common';
import { ThaidatePipe } from '../../../core/pipes/thaidate.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgbDropdownModule,
    FormsModule, 
    NgbDatepickerModule, 
    NgApexchartsModule,
    FeatherIconDirective,
    CurrencyPipe,
    NgClass,
    CommonModule,
    ThaidatePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  /**
   * NgbDatepicker
   */
  currentDate: NgbDateStruct = inject(NgbCalendar).getToday();

  /**
   * Apex chart
   */
  public customersChartOptions: ApexOptions | any;
  public ordersChartOptions: ApexOptions | any;
  public growthChartOptions: ApexOptions | any;
  public revenueChartOptions: ApexOptions | any;
  public monthlySalesChartOptions: ApexOptions | any;
  public cloudStorageChartOptions: ApexOptions | any;
  public chartOptions: ApexOptions | any;
  karapanAll: any;
  borrowAll: any;
  sumdeductedAmount: any;
  borrowData: any[] = [];
  patiantBorwlat: any;
  borrowOx: any[] = [];
  themeCssVariables = inject(ThemeCssVariableService).getThemeCssVariables();

  constructor(private apiDataService: ApiDataService) {}

  ngOnInit(): void {
    this.customersChartOptions = this.getCustomersChartOptions(this.themeCssVariables);
    this.ordersChartOptions = this.getOrdersChartOptions(this.themeCssVariables);
    this.monthlySalesChartOptions = this.getMonthlySalesChartOptions(this.themeCssVariables);
    this.cloudStorageChartOptions = this.getCloudStorageChartOptions(this.themeCssVariables);
    this.loadData();
  }
  getStatusBadge(status: string) {
    return status === 'ยังไม่คืน' ? 'bg-danger' : 'bg-success';
  }
  loadData() {
    this.apiDataService.getLatestBorrower().subscribe({
      next: (res)=>{
        this.patiantBorwlat = res.data;
      },
      error: (err)=>{
        console.error(err);
      }
    });
    this.apiDataService.countKarupanAll().subscribe(data => {
      this.karapanAll = data;
    });
    this.apiDataService.countBorrowAll().subscribe(data => {
      this.borrowAll = data;
    });
    this.apiDataService.countfinance().subscribe(data => {
      this.sumdeductedAmount = data;
    });
    this.apiDataService.getBorwbad().subscribe({ 
      next: (res)=>{
        this.borrowData = res.data;
      },
      error: (err)=>{
        console.error(err);
      }
     });
     this.apiDataService.getBorwOx().subscribe({
      next: (res) =>{
        this.borrowOx = res.data;
      },
      error: (err)=>{
        console.error(err)
      }
     });
    this.apiDataService.getBorrowStats().subscribe(res =>{
      const apiData = res.data;

      const monthMap:any = {
        10:0, 11:0, 12:0,
        1:0, 2:0, 3:0,
        4:0, 5:0, 6:0,
        7:0, 8:0, 9:0
      };

      apiData.forEach((item:any)=>{
        monthMap[item._id] = item.total;
      });

      const months = [
        "ต.ค","พ.ย","ธ.ค","ม.ค","ก.พ","มี.ค",
        "เม.ย","พ.ค","มิ.ย","ก.ค","ส.ค","ก.ย"
      ];

      const totals = [
        monthMap[10],
        monthMap[11],
        monthMap[12],
        monthMap[1],
        monthMap[2],
        monthMap[3],
        monthMap[4],
        monthMap[5],
        monthMap[6],
        monthMap[7],
        monthMap[8],
        monthMap[9]
      ];

      this.chartOptions = {
        series: [{
          name: "จำนวนการยืม",
          data: totals
        }],
        chart: {
          type: "bar",
          height: 350
        },
        xaxis: {
          categories: months
        },
        title:{
          text:"สถิติการยืมครุภัณฑ์ ปีงบประมาณ 2569"
        }
      };
    });
  }


  /**
   * Customerse chart options
   */
  getCustomersChartOptions(themeVariables: ThemeCssVariablesType) {
    return {
      series: [{
        name: '',
        data: [3844, 3855, 3841, 3867, 3822, 3843, 3821, 3841, 3856, 3827, 3843]
      }],
      chart: {
        type: "line",
        height: 60,
        sparkline: {
          enabled: !0
        }
      },
      colors: [themeVariables.primary],
      xaxis: {
        type: 'datetime',
        categories: ["Jan 01 2024", "Jan 02 2024", "Jan 03 2024", "Jan 04 2024", "Jan 05 2024", "Jan 06 2024", "Jan 07 2024", "Jan 08 2024", "Jan 09 2024", "Jan 10 2024", "Jan 11 2024",],
      },
      stroke: {
        width: 2,
        curve: "smooth"
      },
      markers: {
        size: 0
      },
    }
  };



  /**
   * Orders chart options
   */
  getOrdersChartOptions(themeVariables: ThemeCssVariablesType) {
    return {
      series: [{
        name: '',
        data: [36, 77, 52, 90, 74, 35, 55, 23, 47, 10, 63]
      }],
      chart: {
        type: "bar",
        height: 60,
        sparkline: {
          enabled: !0
        }
      },
      colors: [themeVariables.primary],
      plotOptions: {
        bar: {
          borderRadius: 2,
          columnWidth: "60%"
        }
      },
      xaxis: {
        type: 'datetime',
        categories: ["Jan 01 2024", "Jan 02 2024", "Jan 03 2024", "Jan 04 2024", "Jan 05 2024", "Jan 06 2024", "Jan 07 2024", "Jan 08 2024", "Jan 09 2024", "Jan 10 2024", "Jan 11 2024",],
      }
    }
  };


  /**
   * Monthly sales chart options
   */
  getMonthlySalesChartOptions(themeVariables: ThemeCssVariablesType) {
    return {
      series: [{
        name: 'Sales',
        data: [5,2,4,3,3,2,1,5,4,1,1,2]
      }],
      chart: {
        type: 'bar',
        height: '330',
        parentHeightOffset: 0,
        foreColor: themeVariables.secondary,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      colors: [themeVariables.primary],  
      fill: {
        opacity: .9
      } , 
      grid: {
        padding: {
          bottom: -4
        },
        borderColor: themeVariables.gridBorder,
        xaxis: {
          lines: {
            show: true
          }
        }
      },
      xaxis: {
        type: 'datetime',
        categories: ['01/01/2024','02/01/2024','03/01/2024','04/01/2024','05/01/2024','06/01/2024','07/01/2024', '08/01/2024','09/01/2024','10/01/2024', '11/01/2024', '12/01/2024'],
        axisBorder: {
          color: themeVariables.gridBorder,
        },
        axisTicks: {
          color: themeVariables.gridBorder,
        },
      },
      yaxis: {
        title: {
          text: 'จำนวนคนยืม ',
          style:{
            size: 9,
            color: themeVariables.secondary
          }
        },
        labels: {
          offsetX: 0,
        },
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: 'center',
        fontFamily: themeVariables.fontFamily,
        itemMargin: {
          horizontal: 8,
          vertical: 0
        },
      },
      stroke: {
        width: 0
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '10px',
          fontFamily: themeVariables.fontFamily,
        },
        offsetY: -27
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
          borderRadius: 4,
          dataLabels: {
            position: 'top',
            orientation: 'vertical',
          }
        },
      }
    }
  }



  /**
   * Cloud storage chart options
   */
  getCloudStorageChartOptions(themeVariables: ThemeCssVariablesType) {
    return {
      series: [67],
      chart: {
        height: 260,
        type: "radialBar"
      },
      colors: [themeVariables.primary],
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 15,
            size: "70%"
          },
          track: {
            show: true,
            background: themeVariables.gridBorder,
            strokeWidth: '100%',
            opacity: 1,
            margin: 5, 
          },
          dataLabels: {
            showOn: "always",
            name: {
              offsetY: -11,
              show: true,
              color: themeVariables.secondary,
              fontSize: "13px"
            },
            value: {
              color: themeVariables.secondary,
              fontSize: "30px",
              show: true
            }
          }
        }
      },
      fill: {
        opacity: 1
      },
      stroke: {
        lineCap: "round",
      },
      labels: ["Storage Used"]
    }
  };
  
}
