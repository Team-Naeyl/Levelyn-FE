import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes, css } from '@emotion/react';

import ItemBox from '../ItemBox';
import ProgressBar from '../ProgressBar';
import { useNotification } from '../../../contexts/NotificationContext';
import { connectSSE, disconnectSSE } from '../../../services/sse';
import type { BattleStreamData } from '../../../types/battle.types';

import backgroundImage from '../../../assets/background.png';
import avatarImage from '../../../assets/avatar.png';
import mockImage from '../../../assets/mockimge.png';
import skillImage from '../../../assets/skill.png';

interface BattleState {
  monster: {
    name: string;
    hp: number;
    maxHp: number;
    avatarUrl: string;
  };
}

export default function CombatModalContent() {
  const { battleId, initialBattleData, hideCombatModal } = useNotification();

  const [battleState, setBattleState] = useState<BattleState | null>(() => {
    if (!initialBattleData) return null;
    return {
      monster: {
        name: initialBattleData.mob.name,
        hp: initialBattleData.mob.hp,
        maxHp: initialBattleData.mob.hp,
        avatarUrl: '',
      },
    };
  });
  const [showSkill, setShowSkill] = useState(false);
  const [isHit, setIsHit] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (!battleId) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          hideCombatModal();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [battleId, hideCombatModal]);

  useEffect(() => {
    if (!battleId) return;

    const endpoint = `/api/battles/${battleId}`;

    const handleBattleStream = (data: BattleStreamData) => {
      if (data.damage > 0) {
        setShowSkill(true);
        setTimeout(() => setShowSkill(false), 500); // 공격 모션
        setIsHit(true);
        setTimeout(() => setIsHit(false), 300); // 피격 모션
      }

      setBattleState((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          monster: { ...prev.monster, hp: data.mobHp },
        };
      });

      if (data.done) {
        console.log('전투 종료:', data);
        setTimeLeft(0);
        setTimeout(() => {
          disconnectSSE(endpoint);
          hideCombatModal();
        }, 2000);
      }
    };

    connectSSE(endpoint, {
      message: handleBattleStream,
    });

    return () => {
      disconnectSSE(endpoint);
    };
  }, [battleId, hideCombatModal]);

  if (!battleState) {
    return <LoadingWrapper>전투 정보를 불러오는 중...</LoadingWrapper>;
  }

  const { monster } = battleState;

  return (
    <Wrapper>
      <TopSection>
        <BackgroundImage />
        <CharacterArea isAttacking={showSkill}>
          <img
            src={avatarImage}
            alt="Character"
          />
        </CharacterArea>
        <MonsterArea isHit={isHit}>
          <img
            src={monster.avatarUrl || mockImage}
            alt={monster.name}
          />
        </MonsterArea>
        {showSkill && (
          <SkillArea>
            <img
              src={skillImage}
              alt="Skill Effect"
            />
          </SkillArea>
        )}
      </TopSection>
      <BottomSection>
        <SkillSlots>
          <SlotWrapper>
            <ItemBox
              size="fullwidth"
              imageURL="https://picsum.photos/seed/combatskill1/64"
            />
          </SlotWrapper>
          <SlotWrapper>
            <ItemBox
              size="fullwidth"
              imageURL="https://picsum.photos/seed/combatskill2/64"
            />
          </SlotWrapper>
          <SlotWrapper>
            <ItemBox
              size="fullwidth"
              imageURL="https://picsum.photos/seed/combatskill3/64"
            />
          </SlotWrapper>
        </SkillSlots>
        <ProgressBars>
          <ProgressBar
            variant="exp"
            label={monster.name}
            total={monster.maxHp}
            current={monster.hp}
            width="100%"
            height={20}
          />
          <ProgressBar
            variant="timer"
            label="Timer"
            total={10}
            current={timeLeft}
            width="100%"
            height={20}
          />
        </ProgressBars>
      </BottomSection>
    </Wrapper>
  );
}

const LoadingWrapper = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  ${({ theme }) => theme.textStyles.H_B_24};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
`;

const TopSection = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  border-bottom: 2px solid black;
  background-color: #333;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  filter: grayscale(80%) brightness(100%);
  opacity: 0.9;
  z-index: 0;
`;

const ImageContainerBase = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const attackAnimation = keyframes`
  50% {
    transform: translateY(-50%) translateX(20px);
  }
`;

const CharacterArea = styled(ImageContainerBase)<{ isAttacking?: boolean }>`
  width: 80px;
  height: 80px;
  left: 40px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;

  ${({ isAttacking }) =>
    isAttacking &&
    css`
      animation: ${attackAnimation} 0.5s ease-in-out;
    `}
`;

const hitAnimation = keyframes`
  0%, 100% { transform: translateY(-50%) translateX(0); }
  25% { transform: translateY(-50%) translateX(-5px); }
  50% { transform: translateY(-50%) translateX(5px); }
  75% { transform: translateY(-50%) translateX(-5px); }
`;

const MonsterArea = styled(ImageContainerBase)<{ isHit?: boolean }>`
  width: 100px;
  height: 100px;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;

  ${({ isHit }) =>
    isHit &&
    css`
      animation: ${hitAnimation} 0.3s linear;
    `}
`;

const skillAnimation = keyframes`
  0%, 100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const SkillArea = styled(ImageContainerBase)`
  width: 70px;
  height: 70px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  animation: ${skillAnimation} 0.5s ease-in-out;
`;

const BottomSection = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const SkillSlots = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  flex: 1;
`;

const SlotWrapper = styled.div`
  width: 60px;
  height: 60px;
`;

const ProgressBars = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;
