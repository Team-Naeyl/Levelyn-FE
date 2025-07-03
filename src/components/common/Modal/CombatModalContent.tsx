import styled from '@emotion/styled';
import ItemBox from '../ItemBox';
import ProgressBar from '../ProgressBar';

export default function CombatModalContent() {
  return (
    <Wrapper>
      <TopSection>
        <CharacterArea>캐릭터</CharacterArea>
        <MonsterArea>몬스터</MonsterArea>
        <SkillArea>스킬 효과</SkillArea>
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
  background-color: ${({ theme }) => theme.colors.gray[200]};
  border-bottom: 2px solid black;
`;

const CharacterArea = styled.div`
  position: absolute;
  width: 80px;
  height: 80px;
  background-color: ${({ theme }) => theme.colors.error[300]};
  border: 2px solid black;
  left: 40px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MonsterArea = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  background-color: ${({ theme }) => theme.colors.secondary[300]};
  border: 2px solid black;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SkillArea = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: yellow;
  border: 2px solid black;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
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
