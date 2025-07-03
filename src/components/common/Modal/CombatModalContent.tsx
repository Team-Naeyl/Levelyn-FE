import { useState, useEffect } from 'react';
import styled from '@emotion/styled';

import { keyframes, css } from '@emotion/react';

import ItemBox from '../ItemBox';
import ProgressBar from '../ProgressBar';

import backgroundImage from '../../../assets/background.png';
import avatarImage from '../../../assets/avatar.png';
import mockImage from '../../../assets/mockimge.png';
import skillImage from '../../../assets/skill.png';

export default function CombatModalContent() {
  const [showSkill, setShowSkill] = useState(false);

  useEffect(() => {
    const randomDelay = Math.random() * 1000 + 1000; // 1~2초 사이의 랜덤 딜레이
    const timer = setInterval(() => {
      setShowSkill(true);
      setTimeout(() => setShowSkill(false), 500); // 0.5초간 스킬 표시
    }, randomDelay);

    return () => clearInterval(timer);
  }, []);

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
        <MonsterArea isHit={showSkill}>
          <img
            src={mockImage}
            alt="Monster"
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
            variant="timer"
            label="시간"
            total={60}
            current={45}
            width="100%"
            height={20}
          />
          <ProgressBar
            variant="exp"
            label="HP"
            total={100}
            current={80}
            width="100%"
            height={20}
          />
        </ProgressBars>
      </BottomSection>
    </Wrapper>
  );
}

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
