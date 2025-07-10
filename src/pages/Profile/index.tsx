import { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import ProgressBar from '../../components/common/ProgressBar';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import { useAuth } from '../../contexts/AuthContext';
import ItemBox from '../../components/common/ItemBox';
import { getMyPageData } from '../../services/myPage';
import { getImageUrl } from '../../services/appwrite';
import type { MyPageData } from '../../types/myPage.types';
import avatarImage from '../../assets/avatar.png';

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

export default function Profile() {
  const { logout } = useAuth();
  const [data, setData] = useState<MyPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myPageData = await getMyPageData();
        setData(myPageData);
      } catch (err) {
        setError('프로필 정보를 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = useMemo(() => {
    if (!data) return [];
    return [
      { name: 'atk', value: data.character.state.attack },
      { name: 'wil', value: data.character.state.will },
    ];
  }, [data]);

  const equippedItems = useMemo(() => {
    if (!data) return [];
    return data.character.itemsSlot.filter((item) => item.equipped).sort((a, b) => a.type.id - b.type.id);
  }, [data]);

  if (isLoading) {
    return (
      <Container>
        <Header
          isMain={false}
          title="프로필"
        />
        <LoadingContainer>로딩 중...</LoadingContainer>
      </Container>
    );
  }

  if (error || !data) {
    return (
      <Container>
        <Header
          isMain={false}
          title="프로필"
        />
        <ErrorContainer>{error || '데이터를 불러올 수 없습니다.'}</ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header
        isMain={false}
        title="프로필"
      />
      <CharacterSection>
        <ImagePlaceholder src={avatarImage} />
        <InfoContainer>
          <NameLevelRow>
            <span>{data.profile.name}</span>
            <span>Lv. {data.character.state.level}</span>
          </NameLevelRow>
          <ProgressBar
            variant="exp"
            label="EXP"
            total={100}
            current={data.character.state.exp}
            width="100%"
            height={12}
          />
          <StatsContainer>
            {stats.map((stat, index) => (
              <StatRow key={index}>
                <StatLabel>{stat.name}</StatLabel>
                <StatValue>{stat.value}</StatValue>
              </StatRow>
            ))}
          </StatsContainer>
          <SectionTitle>장착한 아이템</SectionTitle>
          <EquippedItemsSection>
            {equippedItems.slice(0, 5).map((item) => {
              const prefix = getItemImagePrefix(item.type.id);
              const imageURL = getImageUrl(`${prefix}${item.id}`);
              return (
                <ItemBox
                  key={item.id}
                  imageURL={imageURL}
                />
              );
            })}
            {Array.from({ length: Math.max(0, 5 - equippedItems.length) }).map((_, index) => (
              <ItemBox
                key={`placeholder-${index}`}
                imageURL=""
              />
            ))}
          </EquippedItemsSection>
        </InfoContainer>
      </CharacterSection>
      <StatsSection>통계</StatsSection>
      <LogoutButtonSection>
        <Button
          label="로그아웃"
          variant="texted"
          color="error"
          size="small"
          fullWidth
          onClick={logout}
        />
      </LogoutButtonSection>
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

const ImagePlaceholder = styled.img`
  width: 152px;
  height: 100%;
  background-color: transparent;
  border-radius: 4px;
  flex-shrink: 0;
  object-fit: cover;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
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

const LogoutButtonSection = styled.div`
  cursor: pointer;
  width: 100%;
  margin-top: auto;
`;

const SectionTitle = styled.h3`
  ${({ theme }) => theme.textStyles.H_B_16};
  color: ${({ theme }) => theme.colors.black};

  margin-top: 16px;
`;

const EquippedItemsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.error[500]};
`;
