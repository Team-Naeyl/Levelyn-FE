import { createContext, useState, useContext, type PropsWithChildren, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { connectSSE, disconnectAllSSE } from '../services/sse';
import Modal from '../components/common/Modal';
import CombatModalContent from '../components/common/Modal/CombatModalContent';
import EventModalContent from '../components/common/Modal/EventModalContent';
import type { InitialBattleData } from '../types/battle.types';
import type { BattleStreamData } from '../types/battle.types';
import { getImageUrl } from '../services/appwrite';

export interface AppNotification {
  id: string;
  type: 'REWARD' | 'LEVEL_UP';
  data: any;
}
interface NotificationContextType {
  isCombatModalOpen: boolean;
  battleId: string | null;
  initialBattleData: InitialBattleData | null;
  showCombatModal: (id: string, initialData: InitialBattleData) => void;
  hideCombatModal: () => void;
  battleStream: BattleStreamData[];
}

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

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [isCombatModalOpen, setIsCombatModalOpen] = useState(false);
  const [battleId, setBattleId] = useState<string | null>(null);
  const [initialBattleData, setInitialBattleData] = useState<InitialBattleData | null>(null);
  const { isLoggedIn, accessToken } = useAuth();
  const [battleStream, setBattleStream] = useState<BattleStreamData[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const showCombatModal = useCallback((id: string, initialData: InitialBattleData) => {
    setBattleId(id);
    setInitialBattleData(initialData);
    setIsCombatModalOpen(true);
  }, []);

  const hideCombatModal = useCallback(() => {
    setIsCombatModalOpen(false);
    setBattleId(null);
    setInitialBattleData(null);
  }, []);

  const dismissCurrentNotification = () => {
    setNotifications((prev) => prev.slice(1));
  };

  useEffect(() => {
    if (isLoggedIn && accessToken) {
      const eventHandlers = {
        BATTLE: (data: InitialBattleData) => {
          console.log('Battle created event received:', data);
          showCombatModal(data.id, data);
        },
        BATTLE_STREAM: (data: BattleStreamData) => {
          setBattleStream((prev) => [...prev, data]);
        },
        REWARD: (data: any) => {
          console.log('Reward received:', data);
          setNotifications((prev) => [...prev, { id: `reward-${Date.now()}`, type: 'REWARD', data }]);
        },
        LEVEL_UP: (data: any) => {
          console.log('Level-up received:', data);
          setNotifications((prev) => [...prev, { id: `levelup-${Date.now()}`, type: 'LEVEL_UP', data }]);
        },
      };

      connectSSE('/api/notifications/', eventHandlers);

      return () => {
        disconnectAllSSE();
      };
    }
  }, [isLoggedIn, showCombatModal, accessToken]);

  const value = {
    isCombatModalOpen,
    battleId,
    initialBattleData,
    showCombatModal,
    hideCombatModal,
    battleStream,
  };

  const currentNotification = notifications[0];
  let rewardImageUrl: string | undefined;
  let rewardDescription = '보상을 획득했습니다.';

  if (currentNotification?.type === 'REWARD') {
    const { items, exp, coin } = currentNotification.data;
    const descriptionParts: string[] = [];

    if (items && items.length > 0) {
      const firstItem = items[0];
      const prefix = getItemImagePrefix(firstItem.type.id);
      const fileId = `${prefix}${firstItem.id}`;
      rewardImageUrl = getImageUrl(fileId);
      descriptionParts.push(firstItem.name);
    }

    if (exp) {
      descriptionParts.push(`EXP +${exp}`);
    }
    if (coin) {
      descriptionParts.push(`Coin +${coin}`);
    }

    if (descriptionParts.length > 0) {
      rewardDescription = descriptionParts.join('\n');
    }
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {isCombatModalOpen && initialBattleData && (
        <Modal
          isOpen={isCombatModalOpen}
          onClose={hideCombatModal}
          noPadding={true}
          hasDefaultContainer={true}
        >
          <CombatModalContent initialData={initialBattleData} />
        </Modal>
      )}
      {currentNotification && !isCombatModalOpen && (
        <Modal
          key={currentNotification.id}
          isOpen={!!currentNotification}
          onClose={dismissCurrentNotification}
        >
          {currentNotification.type === 'REWARD' && (
            <EventModalContent
              onConfirm={dismissCurrentNotification}
              title="보상 획득!"
              imageUrl={rewardImageUrl}
              description={rewardDescription}
            />
          )}
          {currentNotification.type === 'LEVEL_UP' && (
            <EventModalContent
              onConfirm={dismissCurrentNotification}
              title="레벨 업!"
              description={`레벨 ${currentNotification.data.level}을 달성했습니다!`}
            />
          )}
        </Modal>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('NotificationContext가 없습니다');
  }
  return context;
};
