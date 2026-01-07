import { Injectable } from '@angular/core';
import { TAMBON_DATA } from './tambon-data';
export interface MooData {
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
    return this.tambonData.find(t => t.tambon === tambon)?.villages || [];
  }

  getMooByVillage(tambon: string, village: string): string[] {
    return (
      this.tambonData
        .find(t => t.tambon === tambon)?.villages.find(v => v.village === village)?.moo || []
    );
  }

  constructor() { }
}
