import { Component ,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,FormBuilder } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-receive',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbDatepickerModule
  ],
  templateUrl: './receive.component.html',
  styleUrl: './receive.component.scss'
})
export class ReceiveComponent {
  selectedDate: NgbDateStruct;

  constructor(fb:FormBuilder){
    
   }
  


}
