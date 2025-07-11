import { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import ProgressBar from '../../components/common/ProgressBar';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import { useAuth } from '../../contexts/AuthContext';
import CustomBarChart from '../../components/common/BarChart';
import { getMyPageData } from '../../services/myPage';
import { getImageUrl } from '../../services/appwrite';
import type { MyPageData } from '../../types/myPage.types';
import avatarImage from '../../assets/avatar.png';
import { getDailyStats } from '../../utils/localStorage';
import EquippedAvatar from '../Inventory/.components/EquippedAvatar';

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

const ITEM_TYPES = [
  { id: 1, label: '무기' },
  { id: 2, label: '팔찌' },
  { id: 3, label: '목걸이' },
  { id: 4, label: '반지' },
  { id: 5, label: '귀걸이' },
];

export default function Profile() {
  const { logout } = useAuth();
  const [data, setData] = useState<MyPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);

  const updateChartData = () => {
    const dailyStats = getDailyStats();
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      const shortDate = dateString.substring(5).replace('-', '/');
      data.push({
        name: shortDate,
        value: dailyStats[dateString] || 0,
      });
    }
    setChartData(data);
  };

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
    updateChartData();

    window.addEventListener('focus', updateChartData);
    return () => {
      window.removeEventListener('focus', updateChartData);
    };
  }, []);

  useEffect(() => {
    if (data) {
      const imageUrls = [
        ...data.character.itemsSlot
          .filter((item) => item.equipped)
          .map((item) => getImageUrl(`${getItemImagePrefix(item.type.id)}${item.id}`)),
        ...data.character.skillsSlot.filter((skill) => skill.equipped).map((skill) => getImageUrl(`skill-${skill.id}`)),
      ];

      imageUrls.forEach((url) => {
        new Image().src = url;
      });
    }
  }, [data]);

  const characterStats = useMemo(() => {
    if (!data) return [];
    return [
      { name: 'atk', value: data.character.state.attack },
      { name: 'wil', value: data.character.state.will },
    ];
  }, [data]);

  const equippedItems = useMemo(() => {
    if (!data) return [];
    return ITEM_TYPES.map((type) => {
      const item = data.character.itemsSlot.find((i) => i.equipped && i.type.id === type.id);
      return {
        label: type.label,
        item: item
          ? {
              id: item.id,
              imageURL: getImageUrl(`${getItemImagePrefix(item.type.id)}${item.id}`),
            }
          : null,
      };
    });
  }, [data]);

  const appliedEffects = useMemo(() => {
    if (!data) return [];
    return data.character.itemsSlot
      .filter((item) => item.equipped && item.description.includes('\n'))
      .flatMap((item) => item.description.split('\n').slice(1))
      .flatMap((effect) => effect.split(',').map((e) => e.trim()));
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
        <ProfileInfoSection>
          <NameLevelGroup>
            <span>{data.profile.name}</span>
            <span>Lv. {data.character.state.level}</span>
          </NameLevelGroup>
          <ProgressBar
            variant="exp"
            label="EXP"
            total={100}
            current={data.character.state.exp}
            width="100%"
            height={18}
          />
        </ProfileInfoSection>
        <EquippedAvatar
          avatarImg={avatarImage}
          slots={equippedItems.map((slot) => ({
            label: slot.label,
            item: slot.item,
            onClick: () => {},
          }))}
        />
        <Divider />
        <InfoRow>
          <InfoColumn>
            <SectionTitle>능력치</SectionTitle>
            <StatsContainer>
              {characterStats.map((stat, index) => (
                <StatRow key={index}>
                  <StatLabel>{stat.name}</StatLabel>
                  <StatValue>{stat.value}</StatValue>
                </StatRow>
              ))}
            </StatsContainer>
          </InfoColumn>
          <InfoColumn>
            <SectionTitle>적용된 효과</SectionTitle>
            <AppliedEffectsContainer>
              {appliedEffects.map((effect, index) => (
                <EffectItem key={index}>{effect}</EffectItem>
              ))}
            </AppliedEffectsContainer>
          </InfoColumn>
        </InfoRow>
      </CharacterSection>
      <StatsSection>
        <SectionTitle>주간 통계</SectionTitle>
        <CustomBarChart data={chartData} />
      </StatsSection>
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
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 16px;
  margin-bottom: 20px;
  box-sizing: border-box;
`;

const ProfileInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: left;
`;

const InfoRow = styled.div`
  display: flex;
`;

const InfoColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;

  & + & {
    margin-left: 24px;
    padding-left: 24px;
    border-left: 1px solid ${({ theme }) => theme.colors.gray[200]};
  }
`;

const NameLevelGroup = styled.div`
  ${({ theme }) => theme.textStyles.H_B_18};
  color: ${({ theme }) => theme.colors.black};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatRow = styled.div`
  display: flex;
  width: 100%;
  ${({ theme }) => theme.textStyles.B_R_14};
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
    padding: 16px;

    display: flex;
    flex-direction: column;
    gap: 8px;
    color: ${theme.colors.black};
    margin-bottom: 20px;
    box-sizing: border-box;

    & > h3 {
      margin: 0;
    }
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

const AppliedEffectsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const EffectItem = styled.div`
  ${({ theme }) => theme.textStyles.B_R_14};
  color: ${({ theme }) => theme.colors.black};
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

const Divider = styled.div`
  height: 5px;
  width: 100vw;
  background-color: ${({ theme }) => theme.colors.gray[100]};
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`;
