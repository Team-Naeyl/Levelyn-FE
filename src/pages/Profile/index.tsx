import styled from '@emotion/styled';
import ProgressBar from '../../components/common/ProgressBar';
import { css } from '@emotion/react';

const mockCharacter = {
  nickname: '콩콩잉',
  level: 3,
  exp: 70,
  maxExp: 100,
  stats: [
    { name: 'str', value: 2 },
    { name: 'int', value: 3 },
    { name: 'wil', value: 4 },
  ],
  appliedEffects: '적용된 추가 효과',
};

export default function Profile() {
  return (
    <Container>
      <Header>프로필</Header>
      <CharacterSection>
        <ImagePlaceholder />
        <InfoContainer>
          <NameLevelRow>
            <span>{mockCharacter.nickname}</span>
            <span>Lv. {mockCharacter.level}</span>
          </NameLevelRow>
          <ProgressBar
            variant="exp"
            label="EXP"
            total={mockCharacter.maxExp}
            current={mockCharacter.exp}
            width="100%"
            height={10}
          />
          <StatsContainer>
            {mockCharacter.stats.map((stat, index) => (
              <StatRow key={index}>
                <StatLabel>{stat.name}</StatLabel>
                <StatValue>{stat.value}</StatValue>
              </StatRow>
            ))}
          </StatsContainer>
          <Effects>{mockCharacter.appliedEffects}</Effects>
        </InfoContainer>
      </CharacterSection>
      <StatsSection>통계</StatsSection>
      <LogoutButton>로그아웃</LogoutButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding: 0 20px 80px;
  box-sizing: border-box;
`;

const Header = styled.header`
  ${({ theme }) => css`
    width: 100%;
    padding: 20px 0;
    font-size: ${theme.textStyles.H_B_18};
    text-align: center;
    color: ${theme.colors.black};
    margin-bottom: 20px;
  `}
`;

const CharacterSection = styled.div`
  ${({ theme }) => css`
    display: flex;
    gap: 16px;
    width: 100%;
    padding: 16px;
    border: 1px solid ${theme.colors.black};
    margin-bottom: 20px;
    box-sizing: border-box;
  `}
`;

const ImagePlaceholder = styled.div`
  width: 152px;
  height: 224px;
  background-color: #f0f0f0;
  border-radius: 4px;
  flex-shrink: 0;
`;

const InfoContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  `}
`;

const NameLevelRow = styled.div`
  ${({ theme }) => css`
    ${theme.textStyles.H_B_16};
    display: flex;
    justify-content: space-between;
    width: 100%;
    color: ${theme.colors.black};
  `}
`;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatRow = styled.div`
  display: flex;
  width: 100%;
`;

const StatLabel = styled.span`
  width: 36px;
`;

const StatValue = styled.span`
  margin-left: auto;
`;

const Effects = styled.div`
  ${({ theme }) => css`
    ${theme.textStyles.L_SB_12};
    color: ${theme.colors.black};
  `}
`;

const StatsSection = styled.div`
  ${({ theme }) => css`
    width: 100%;
    height: 100px;
    border: 1px solid ${theme.colors.black};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors.black};
    margin-bottom: 20px;
  `}
`;

const LogoutButton = styled.button`
  ${({ theme }) => css`
    color: ${theme.colors.error[500]};
    background: none;
    border: none;
    font-size: ${theme.textStyles.H_B_16};
    cursor: pointer;
    margin-top: auto;
    padding-bottom: 20px;
  `}
`;
