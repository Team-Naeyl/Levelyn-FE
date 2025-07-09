import api from './api';
import type { InventoryItem, GetInventoryItemsResponse, GetInventorySkillsResponse } from '../types/inventory.types';

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  const response = await api.get<GetInventoryItemsResponse>('/api/inventory/items');
  return response.data.results;
};

export const getInventorySkills = async (): Promise<InventoryItem[]> => {
  const response = await api.get<GetInventorySkillsResponse>('/api/inventory/skills');
  return response.data.skills;
};

export const updateEquippedSkills = async (skillIds: number[]): Promise<void> => {
  await api.put('/api/inventory/skills/slot', { skillIds });
};

export const updateEquippedItems = async (itemIds: number[]): Promise<void> => {
  await api.patch('/api/inventory/items/slot', { itemIds });
};
