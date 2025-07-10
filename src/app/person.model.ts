export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  imageUrl?: string;
}

export interface AscendantTree {
  root: Person;
  father: AscendantTree | null;
  mother: AscendantTree | null;
}

export interface DescendantTree {
  root: Person;
  spouse: Person | null;
  children: DescendantTree[] | null;
}

export enum TreeType {
  ASCENDANT = 'ascendant',
  DESCENDANT = 'descendant'
}

export interface PersonTree {
  id: number;
  type: TreeType;
}

export interface PersonDetails {
  id: number;
  firstName: string;
  lastName?: string;
  imageUrl?: string;
  biography?: string;
  originPlace?: string;
  gender?: string;
  isAlive?: boolean;
  birthDate?: string;
  deathDate?: string;
  ageThisYear?: number;
}

export interface CheraFamilies {
  id: number;
  name: string;
  description?: string;
  familyHeadId: number;
}