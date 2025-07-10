import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getInventoryItems,
  getInventoryUserSkills,
  updateEquippedSkills,
  updateEquippedItems,
} from '../services/inventory';
import { getImageUrl } from '../services/appwrite';

import type { InventoryItem } from '../types/inventory.types';

export function useInventoryItems() {
  return useQuery<InventoryItem[]>({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      const res = await getInventoryItems();
      return res.map((item: InventoryItem) => ({
        ...item,
        imageURL: getImageUrl(`weapon-${item.id}`),
      }));
    },
  });
}

export function useUpdateItemsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemIds: number[]) => updateEquippedItems(itemIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
    },
  });
}

export function useInventorySkills() {
  return useQuery<InventoryItem[]>({
    queryKey: ['inventory-skills'],
    queryFn: async () => {
      const res = await getInventoryUserSkills();
      return res.map((skill: InventoryItem) => ({
        ...skill,
        imageURL: getImageUrl(`skill-${skill.id}`),
      }));
    },
  });
}

export function useUpdateSkillsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (skillIds: number[]) => updateEquippedSkills(skillIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-skills'] });
    },
  });
}
