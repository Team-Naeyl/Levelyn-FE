export interface InventoryItem {
  id: number;
  name: string;
  description: string;
  imageURL: string;
  equipped: boolean;
  type: { id: number; value: string };
}

export interface GetInventoryItemsResponse {
  results: InventoryItem[];
}

export interface GetInventorySkillsResponse {
  userSkills: InventoryItem[];
}
