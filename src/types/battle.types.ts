export interface Skill {
  id: number;
  name: string;
  description: string;
  type: {
    id: number;
    value: string;
  };
}

export interface Player {
  level: number;
  exp: number;
  attack: number;
  will: number;
  skills: Skill[];
}

export interface Mob {
  id: number;
  type: {
    id: number;
    value: string;
  };
  name: string;
  hp: number;
  regionId: number;
  typeId: number;
}

export interface InitialBattleData {
  id: string;
  mob: Mob;
  player: Player;
}

export interface BattleStreamData {
  skillId: number;
  damage: number;
  mobHp: number;
  done: boolean;
}
