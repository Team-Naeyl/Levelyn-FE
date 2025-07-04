export interface Profile {
  name: string;
  email: string;
}

export interface CharacterState {
  level: number;
  exp: number;
  attack: number;
  will: number;
  position: number;
}

export interface Wallet {
  coin: number;
}

export interface ItemType {
  id: number;
  value: string;
}

export interface ItemSlot {
  id: number;
  type: ItemType;
  name: string;
  description: string;
  equipped: boolean;
}

export interface SkillSlot {
  id: number;
  name: string;
  description: string;
  equipped: boolean;
}

export interface Character {
  state: CharacterState;
  wallet: Wallet;
  itemsSlot: ItemSlot[];
  skillsSlot: SkillSlot[];
}

export interface MyPageData {
  profile: Profile;
  character: Character;
}
