export interface IBook {
  id: string;
  name: string;
  copies: number;
  borrowStatus: BorrowStatus;
}

export enum BorrowStatus {
  New,
  Holding,
  Taken,
}
