import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Header from '../../components/common/Header';
import TextField from '../../components/common/TextField';
import Dropdown from '../../components/common/Dropdown';
import Button from '../../components/common/Button';

type PeriodType = '매주' | '2주' | '한달';

const categoryOptions: { label: string; value: string }[] = [
  { label: '공부', value: '공부' },
  { label: '운동', value: '운동' },
  { label: '업무', value: '업무' },
  { label: '생활', value: '생활' },
  { label: '기타', value: '기타' },
];

export default function TodoForm() {
  const navigate = useNavigate();

  const [period, setPeriod] = useState<PeriodType | undefined>(undefined);
  const periodOptions: PeriodType[] = ['매주', '2주', '한달'];

  const handleDelete = () => {
    console.log('할 일 삭제');
  };

  const handlePeriod = (option: PeriodType) => {
    setPeriod((prev) => (prev === option ? undefined : option));
  };
  return (
    <>
      <Header
        isMain={false}
        title={'할 일'}
        onBack={() => navigate(-1)}
        onDelete={handleDelete}
      />
      <Main>
        <TextField placeholder="할 일을 입력해주세요" />
        <Dropdown
          options={categoryOptions}
          fullWidth={true}
        />
        <ButtonContainer>
          {periodOptions.map((option) => (
            <Button
              key={option}
              label={option}
              onClick={() => handlePeriod(option)}
              color={period === option ? 'primary' : 'ghost'}
              variant={period === option ? 'contained' : 'outlined'}
            />
          ))}
        </ButtonContainer>
      </Main>
    </>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  padding: 16px 12px;
  gap: 24px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direciton: row;
  justify-content: center;
  gap: 16px;
`;
