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
        },
        {
          village: 'บ้านหัวสะพาน',
          moo: ['หมู่ 3', ]
        },
        {
          village: 'บ้านเพียแก้ว',
          moo: ['หมู่ 4', ]
        },
        {
          village: 'บ้านหัวสะพาน',
          moo: ['หมู่ 5', ]
        },
        {
          village: 'บ้านยาง',
          moo: ['หมู่ 6', ]
        },
        {
          village: 'บ้านดอนตูม',
          moo: ['หมู่ 7', ]
        },
        {
          village: 'บ้านแคน',
          moo: ['หมู่ 8', ]
        },
        {
          village: 'บ้านโพธิ์ฮี',
          moo: ['หมู่ 9', ]
        },
        {
          village: 'บ้านโนนขี้เกลือ',
          moo: ['หมู่ 10', ]
        },
        {
          village: 'บ้านยางนกคู่',
          moo: ['หมู่ 11', ]
        },
        {
          village: 'บ้านดอนต้อน',
          moo: ['หมู่ 12', ]
        },
        {
          village: 'บ้านหัวสะพาน',
          moo: ['หมู่ 13', ]
        },
        {
          village: 'บ้านหัวสะพาน',
          moo: ['หมู่ 14', ]
        },
        {
          village: 'บ้านแคน',
          moo: ['หมู่ 15', ]
        },
        {
          village: 'บ้านแคนน้อย',
          moo: ['หมู่ 16', ]
        },
        {
          village: 'บ้านสระบัว',
          moo: ['หมู่ 17', ]
        },
        {
          village: 'บ้านหัวสะพาน',
          moo: ['หมู่ 18', ]
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
