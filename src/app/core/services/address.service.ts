import { Injectable } from '@angular/core';
import { TAMBON_DATA } from './tambon-data';
export interface MooData {
  id:number;
  village: string;
  moo: string[];
}

export interface TambonData {
  tambon: string;
  villages: MooData[];
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
private tambonData: TambonData[] = TAMBON_DATA;

  getTambons(): TambonData[] {
    return this.tambonData;
  }

  getVillagesByTambon(tambon: string): MooData[] {
    const data = this.tambonData.find(t => t.tambon === tambon)?.villages || [];
    return [...data];  // clone กัน mutation
  }

getMooByVillageId(tambon: string, villageId: number): string[] {
  return (
    this.tambonData
      .find(t => t.tambon === tambon)
      ?.villages.find(v => v.id === +villageId)?.moo || []
  );
}

  constructor() { }
}
