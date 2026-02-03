import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thaidate',
  standalone: true
})
export class ThaidatePipe implements PipeTransform {

  private thaiMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  transform(value: string | Date, showDay: boolean = false): string {
        if (!value) return '';

        const date = new Date(value); // ISO string ใช้ได้เลย
        if (isNaN(date.getTime())) return '';

        const day = date.getDate();
        const month = this.thaiMonths[date.getMonth()];
        const year = date.getFullYear() + 543;

        return showDay
          ? `${day} ${month} ${year}`
          : `${month} ${year}`;
    }
}


