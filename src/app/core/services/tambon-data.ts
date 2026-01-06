export interface MooData {
  village: string;
  moo: string[];
}

export interface TambonData {
  tambon: string;
  villages: MooData[];
}

export const TAMBON_DATA: TambonData[] = [
    {
      tambon: 'ตำบลบ้านยาง',
      villages: [
        {
          village: 'บ้านยางน้อย',
          moo: ['หมู่ 1']
        },
        {
          village: 'บ้านโนนขี้เกลือ',
          moo: ['หมู่ 2', ]
        }
      ]
    },
    {
      tambon: 'ตำบลมะเฟือง',
      villages: [
        {
          village: 'บ้านม่วงใต้',
          moo: ['หมู่ 1']
        }
      ]
    }
];
