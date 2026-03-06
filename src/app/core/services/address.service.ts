import { Injectable } from '@angular/core';
import { TAMBON_DATA } from './tambon-data';
export interface MooData {
  id:number;
  village: string;
  moo: string;
}

export interface TambonData {
  tambon: string;
  villages: MooData[];
}
export interface VillageData {
  village: string;
}
@Injectable({
  providedIn: 'root'
})
export class AddressService {
getTambons(): TambonData[] {
  return TAMBON_DATA;
}

getVillagesByTambon(tambonName: string): VillageData[] {

  const tambon = TAMBON_DATA.find(t => t.tambon === tambonName);

  if (!tambon) return [];

  const uniqueVillage = [...new Set(tambon.villages.map(v => v.village))];

  return uniqueVillage.map(v => ({
    village: v
  }));
}

getMoosByVillage(tambonName: string, villageName: string) {

  const tambon = TAMBON_DATA.find(t => t.tambon === tambonName);

  if (!tambon) return [];

  return tambon.villages
    .filter(v => v.village === villageName)
    .map(v => v.moo);
}

  constructor() { }
}
