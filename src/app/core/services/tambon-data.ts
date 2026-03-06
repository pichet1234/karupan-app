export interface Village {
  id: number;
  village: string;
  moo: string;
}

export interface Tambon {
  tambon: string;
  villages: Village[];
}