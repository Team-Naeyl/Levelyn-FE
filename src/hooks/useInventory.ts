import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getInventoryItems,
  getInventorySkills,
  updateEquippedSkills,
  updateEquippedItems,
} from '../services/inventory';
import type { InventoryItem } from '../types/inventory.types';

export function useInventoryItems() {
  return useQuery<InventoryItem[]>({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      const res = await getInventoryItems();
      return res.map((item: InventoryItem) => ({
        ...item,
        imageURL: 'https://picsum.photos/seed/item1/64', // TODO: appWrite 연결
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
      const res = await getInventorySkills();
      return res.map((skill: InventoryItem) => ({
        ...skill,
        imageURL: 'https://picsum.photos/seed/item1/64', // TODO: appWrite 연결
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
