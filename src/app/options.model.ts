export enum ActionType {
  NEW = "new",
  MODIFY = "modify",
  DELETE = "delete"
}

export enum RelativeType {
  ROOT = "root",
  SPOUSE = "spouse",
  FATHER = "father",
  MOTHER = "mother",
  SIBLING = "sibling",
  CHILD = "child"
}

export interface ActionOfNode {
  id: number,
  action: ActionType;
  relative: RelativeType;
}

export interface NewPerson {
  rootPersonId: number;
  relation: RelativeType;
}