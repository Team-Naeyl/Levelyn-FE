import { createContext, useState, useContext, type PropsWithChildren, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { connectSSE, disconnectAllSSE } from '../services/sse';
import Modal from '../components/common/Modal';
import CombatModalContent from '../components/common/Modal/CombatModalContent';
import EventModalContent from '../components/common/Modal/EventModalContent';
import type { InitialBattleData } from '../types/battle.types';

interface NotificationContextType {
  isCombatModalOpen: boolean;
  battleId: string | null;
  initialBattleData: InitialBattleData | null;
  showCombatModal: (id: string, initialData: InitialBattleData) => void;
  hideCombatModal: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [isCombatModalOpen, setIsCombatModalOpen] = useState(false);
  const [battleId, setBattleId] = useState<string | null>(null);
  const [initialBattleData, setInitialBattleData] = useState<InitialBattleData | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const { isLoggedIn } = useAuth();

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

  const showEventModal = useCallback(() => {
    setIsEventModalOpen(true);
  }, []);

  const hideEventModal = useCallback(() => {
    setIsEventModalOpen(false);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      disconnectAllSSE();
      return;
    }

    const handleBattleCreated = (data: InitialBattleData) => {
      console.log('Battle created event received:', data);
      showCombatModal(data.id, data);
    };

    const handleReward = (data: any) => {
      console.log('Reward event received:', data);
      showEventModal();
    };

    const handleLevelUp = (data: any) => {
      console.log('Level-up event received:', data);
      showEventModal();
    };

    connectSSE('/api/notifications/', {
      BATTLE: handleBattleCreated,
      REWARD: handleReward,
      'LEVEL-UP': handleLevelUp,
    });

    return () => {
      disconnectAllSSE();
    };
  }, [isLoggedIn, showCombatModal]);

  const value = {
    isCombatModalOpen,
    battleId,
    initialBattleData,
    showCombatModal,
    hideCombatModal,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {isCombatModalOpen && (
        <Modal
          isOpen={isCombatModalOpen}
          onClose={hideCombatModal}
          noPadding={true}
          hasDefaultContainer={true}
        >
          <CombatModalContent />
        </Modal>
      )}
      {isEventModalOpen && (
        <Modal
          isOpen={isEventModalOpen}
          onClose={hideEventModal}
        >
          <EventModalContent onConfirm={hideEventModal} />
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
