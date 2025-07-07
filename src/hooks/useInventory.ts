import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getInventoryItems,
  getInventorySkills,
  updateEquippedSkills,
  updateEquippedItems,
} from '../services/inventory';

export interface InventoryItem {
  id: number;
  name: string;
  description: string;
  imageURL: string;
  equipped: boolean;
}

// 아이템 목록 가져오기 훅
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

// 아이템 장착/해제 mutation
export function useUpdateItemsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemIds: number[]) => updateEquippedItems(itemIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
    },
  });
}

// 스킬 목록 가져오기 훅
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

// 스킬 장착/해제 mutation
export function useUpdateSkillsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (skillIds: number[]) => updateEquippedSkills(skillIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-skills'] });
    },
  });
}
