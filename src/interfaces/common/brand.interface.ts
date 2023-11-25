export interface Brand {
  _id?: string;
  readOnly?: boolean;
  name?: string;
  nameBn?: string;
  nameIt?: string;
  slug?: string;
  image?: string;
  priority?: number;
  description?: string;
  descriptionBn: string;
  descriptionIt: string;
  createdAt?: Date;
  updatedAt?: Date;
}
