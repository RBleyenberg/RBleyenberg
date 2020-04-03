import { Entity, Key } from '@briebug/ngrx-auto-entity';

@Entity({ modelName: 'Customer' })
export class Customer {
  @Key id: CustomerID;
  name: string;
  catchPhrase: string;
  isActive: boolean;
}

export type CustomerID = number