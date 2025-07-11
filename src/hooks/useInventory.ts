import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getInventoryItems,
  getInventorySkills,
  getInventoryUserSkills,
  updateEquippedSkills,
  updateEquippedItems,
} from '../services/inventory';
import { getImageUrl } from '../services/appwrite';

import type { InventoryItem } from '../types/inventory.types';

const getItemImagePrefix = (typeId: number) => {
  switch (typeId) {
    case 1:
      return 'arms-'; // 무기
    case 2:
      return 'braceletes-'; // 팔찌
    case 3:
      return 'necklaces-'; // 목걸이
    case 4:
      return 'rings-'; // 반지
    case 5:
      return 'earings-'; // 귀걸이
    default:
      return 'item-'; // 기본값 또는 에러 처리
  }
};

export function useInventoryItems() {
  return useQuery<InventoryItem[]>({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      const res = await getInventoryItems();
      return res.map((item: InventoryItem) => {
        const prefix = getItemImagePrefix(item.type.id);
        return {
          ...item,
          imageURL: getImageUrl(`${prefix}${item.id}`),
        };
      });
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
        imageURL: getImageUrl(`skill-${skill.id}`),
      }));
    },
  });
}

export function useInventoryUserSkills() {
  return useQuery<InventoryItem[]>({
    queryKey: ['inventory-user-skills'],
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
