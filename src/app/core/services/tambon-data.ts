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
export const TAMBON_DATA: TambonData[] = [
    {
      tambon: 'ตำบลบ้านยาง',
      villages: [
        { 
          id: 1,
          village: 'บ้านยางน้อย',
          moo: 'หมู่ 1'
        },
        {
          id: 2,
          village: 'บ้านโนนขี้เกลือ',
          moo: 'หมู่ 2'
        },
        {
          id: 3,
          village: 'บ้านหัวสะพาน',
          moo: 'หมู่ 3'
        },
        {
            id: 4,
          village: 'บ้านเพียแก้ว',
          moo: 'หมู่ 4'
        },
        {
          id: 5,
          village: 'บ้านหัวสะพาน',
          moo: 'หมู่ 5' 
        },
        {
          id: 6,
          village: 'บ้านยาง',
          moo: 'หมู่ 6'
        },
        {
            id: 7,
          village: 'บ้านดอนตูม',
          moo: 'หมู่ 7' 
        },
        {
          id: 8,
          village: 'บ้านแคน',
          moo: 'หมู่ 8'
        },
        {
          id: 9,
          village: 'บ้านโพธิ์ฮี',
          moo: 'หมู่ 9' 
        },
        {
          id: 10,
          village: 'บ้านโนนขี้เกลือ',
          moo: 'หมู่ 10'
        },
        {
            id: 11,
          village: 'บ้านยางนกคู่',
          moo: 'หมู่ 11'
        },
        {
          id: 12,
          village: 'บ้านดอนต้อน',
          moo: 'หมู่ 12'
        },
        {
          id: 13,
          village: 'บ้านหัวสะพาน',
          moo: 'หมู่ 13'
        },
        {
            id: 14, 
          village: 'บ้านหัวสะพาน',
          moo: 'หมู่ 14'
        },
        {
          id: 15,
          village: 'บ้านแคน',
          moo: 'หมู่ 15'
        },
        {
          id: 16,
          village: 'บ้านแคนน้อย',
          moo: 'หมู่ 16'
        },
        {
          id: 17,
          village: 'บ้านสระบัว',
          moo: 'หมู่ 17'
        },
        {
          id: 18,
          village: 'บ้านหัวสะพาน',
          moo: 'หมู่ 18'
        }
      ]
    },
    {
      tambon: 'ตำบลมะเฟือง',
      villages: [
        {
          id: 1,
          village: 'บ้านม่วงใต้',
          moo: 'หมู่ 1'
        }
      ]
    }
];
