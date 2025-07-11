import { useState, useEffect, useRef, useMemo } from 'react';
import styled from '@emotion/styled';
import { keyframes, css } from '@emotion/react';

import ItemBox from '../ItemBox';
import ProgressBar from '../ProgressBar';
import { useNotification } from '../../../contexts/NotificationContext';
import { connectSSE, disconnectSSE } from '../../../services/sse';
import type { BattleStreamData, InitialBattleData } from '../../../types/battle.types';
import { getImageUrl } from '../../../services/appwrite';
import Button from '../Button';

import avatarImage from '../../../assets/avatar.png';
import mockImage from '../../../assets/mockimge.png';
import defaultImage from '../../../assets/default.png';

interface BattleState {
  monster: {
    name: string;
    hp: number;
    maxHp: number;
    avatarUrl: string;
  };
}

interface CombatModalContentProps {
  initialData: InitialBattleData;
}

export default function CombatModalContent({ initialData }: CombatModalContentProps) {
  const { battleId, hideCombatModal } = useNotification();

  const backgroundUrl = useMemo(() => getImageUrl(`background-${initialData.mob.type.id}`), [initialData.mob.type.id]);
  const initialMonsterUrl = useMemo(() => getImageUrl(`monster-${initialData.mob.id}`), [initialData.mob.id]);

  const [preloadedUrls, setPreloadedUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const keysToPreload = ['basic-attack', 'tombstone'];
    initialData.player.skills.forEach((skill) => {
      keysToPreload.push(`skill-${skill.id}`);
    });

    const urls: Record<string, string> = {};
    keysToPreload.forEach((key) => {
      urls[key] = getImageUrl(key);
    });

    // 브라우저 캐시에 이미지를 미리 로드합니다.
    new Image().src = backgroundUrl;
    new Image().src = initialMonsterUrl;
    Object.values(urls).forEach((url) => {
      new Image().src = url;
    });

    setPreloadedUrls(urls);
  }, [initialData.player.skills, backgroundUrl, initialMonsterUrl]);

  const [battleState, setBattleState] = useState<BattleState | null>(() => {
    if (!initialData) return null;
    return {
      monster: {
        name: initialData.mob.name,
        hp: initialData.mob.hp,
        maxHp: initialData.mob.hp,
        avatarUrl: initialMonsterUrl,
      },
    };
  });
  const [showSkill, setShowSkill] = useState(false);
  const [skillEffectUrl, setSkillEffectUrl] = useState('');
  const [isHit, setIsHit] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isBattleFinished, setIsBattleFinished] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!battleId) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          if (!isBattleFinished) {
            hideCombatModal();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [battleId, hideCombatModal, isBattleFinished]);

  useEffect(() => {
    if (!battleId) return;

    const endpoint = `/api/battles/${battleId}`;

    const handleBattleStream = (data: BattleStreamData) => {
      if (data.damage > 0) {
        const key = data.skillId === -1 ? 'basic-attack' : `skill-${data.skillId}`;
        const url = preloadedUrls[key];
        if (url) {
          setSkillEffectUrl(url);
        }
        setShowSkill(true);
        setTimeout(() => setShowSkill(false), 500); // 공격 모션
        setIsHit(true);
        setTimeout(() => setIsHit(false), 300); // 피격 모션
      }

      // HP는 항상 즉시 업데이트
      setBattleState((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          monster: { ...prev.monster, hp: data.mobHp },
        };
      });

      if (data.done) {
        // 0.5초 후 묘비 이미지로 변경
        setTimeout(() => {
          setBattleState((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              monster: { ...prev.monster, avatarUrl: preloadedUrls.tombstone || '' },
            };
          });
        }, 500);

        console.log('전투 종료:', data);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        setIsBattleFinished(true);
        setTimeLeft(0);
      }
    };

    connectSSE(endpoint, {
      message: handleBattleStream,
    });

    return () => {
      disconnectSSE(endpoint);
    };
  }, [battleId, preloadedUrls]);

  if (!battleState) {
    return <LoadingWrapper>전투 정보를 불러오는 중...</LoadingWrapper>;
  }

  const { monster } = battleState;

  const handleMonsterImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = mockImage;
  };

  const handleConfirm = () => {
    hideCombatModal();
  };

  const equippedSkills = initialData.player.skills;
  const skillSlotsCount = 3;
  const skillImageUrls = Array.from({ length: skillSlotsCount }).map((_, index) => {
    if (equippedSkills[index]) {
      return getImageUrl(`skill-${equippedSkills[index].id}`);
    }
    return defaultImage;
  });

  return (
    <Wrapper>
      <TopSection>
        <MonsterInfoContainer>
          <ProgressBar
            variant="exp"
            label={monster.name}
            total={monster.maxHp}
            current={monster.hp}
            width="100%"
            height={16}
          />
          <ProgressBar
            variant="timer"
            label="시간"
            total={10}
            current={timeLeft}
            width="100%"
            height={16}
          />
        </MonsterInfoContainer>
        <BackgroundImage backgroundUrl={backgroundUrl} />
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
            onError={handleMonsterImageError}
          />
        </MonsterArea>
        {showSkill && (
          <SkillArea>
            <img
              src={skillEffectUrl}
              alt="Skill Effect"
            />
          </SkillArea>
        )}
      </TopSection>
      <BottomSection>
        <SkillSlots>
          {skillImageUrls.map((url, index) => (
            <SlotWrapper key={index}>
              <ItemBox
                size="fullwidth"
                imageURL={url}
              />
            </SlotWrapper>
          ))}
        </SkillSlots>
        {isBattleFinished && (
          <Button
            label="확인"
            onClick={handleConfirm}
          />
        )}
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

const MonsterInfoContainer = styled.div`
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TopSection = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  border-bottom: 2px solid black;
  background-color: #333;
`;

const BackgroundImage = styled.div<{ backgroundUrl: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.backgroundUrl});
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
    transform: translateY(-10%) translateX(10px);
  }
`;

const CharacterArea = styled(ImageContainerBase)<{ isAttacking?: boolean }>`
  width: 80px;
  height: 80px;
  left: 40px;
  top: 50%;
  transform: translateY(-10%);
  z-index: 2;

  ${({ isAttacking }) =>
    isAttacking &&
    css`
      animation: ${attackAnimation} 0.5s ease-in-out;
    `}
`;

const hitAnimation = keyframes`
  0%, 100% { transform: translateY(-10%) translateX(0); }
  25% { transform: translateY(-10%) translateX(-5px); }
  50% { transform: translateY(-10%) translateX(5px); }
  75% { transform: translateY(-10%) translateX(-5px); }
`;

const MonsterArea = styled(ImageContainerBase)<{ isHit?: boolean }>`
  width: 100px;
  height: 100px;
  right: 40px;
  top: 50%;
  transform: translateY(-10%);
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
    transform: translate(-50%, -10%) scale(1.1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -10%) scale(1);
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
  justify-content: space-between;
  gap: 16px;
`;

const SkillSlots = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`;

const SlotWrapper = styled.div`
  width: 60px;
  height: 60px;
`;
