export interface InventoryItem {
  id: number;
  name: string;
  description: string;
  imageURL: string;
  equipped: boolean;
}

export interface GetInventoryItemsResponse {
  results: InventoryItem[];
}

export interface GetInventorySkillsResponse {
  skills: InventoryItem[];
  userSkills: InventoryItem[];
}
