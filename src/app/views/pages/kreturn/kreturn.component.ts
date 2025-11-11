import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-kreturn',
  standalone: true,
  imports: [
    NgbModule
  ],
  templateUrl: './kreturn.component.html',
  styleUrl: './kreturn.component.scss'
})
export class KreturnComponent {
  private names = ['pichet', 'jirapan', 'sarosa', 'Blueberry', 'Cherry', 'Coconut', 'Grape', 'Grapefruit', 'Kiwi', 'Mango', 'Melon', 'Orange', 'Papaya', 'Pineapple', 'Strawberry'];

  // ฟังก์ชัน search ที่ ngbTypeahead ต้องการ: รับ observable ของ input และคืน observable ของ suggestions
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.names.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) !== -1).slice(0, 10))
    );

  // ถ้าต้องการแสดงผลใน input ต่างจากผลที่ถูกเลือก ให้ใช้ formatter
  formatter = (result: string) => result;
}
