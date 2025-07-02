import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Header from '../../components/common/Header';
import TextField from '../../components/common/TextField';
import Button from '../../components/common/Button';
import { Icon } from '@iconify/react';
import addIcon from '@iconify-icons/material-symbols/add';

import api from '../../services/api';

type PeriodType = '매주' | '2주' | '한달';

interface CreateTodoPayload {
  description?: string;
  date: Date;
  period?: {
    unit: 'years' | 'months' | 'weeks' | 'days';
    amount: number;
  };
}

export default function TodoForm() {
  const navigate = useNavigate();

  const descriptionRef = useRef<HTMLInputElement>(null);
  const [period, setPeriod] = useState<PeriodType | undefined>(undefined);
  const periodOptions: PeriodType[] = ['매주', '2주', '한달'];

  // TODO: 메인페이지에서 id를 받아오는 로직 추가 후 삭제 구현
  const handleDelete = () => {
    console.log('할 일 삭제');
  };

  const handlePeriod = (option: PeriodType) => {
    setPeriod((prev) => (prev === option ? undefined : option));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const description = descriptionRef.current?.value.trim();
    const payload: CreateTodoPayload = {
      description,
      date: new Date(),
    };

    if (period) {
      const amount = period === '2주' ? 2 : 1;
      const unit = period === '한달' ? 'months' : 'weeks';
      payload.period = { unit, amount };
    }

    try {
      await api.post('/api/to-do', payload);
      navigate(-1);
    } catch (err) {
      console.error('할 일 등록 실패:', err);
    }
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
        <TextField
          placeholder="할 일을 입력해주세요"
          ref={descriptionRef}
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
        <Button
          type="submit"
          label="할일 추가"
          onClick={handleSubmit}
          fullWidth
          color="primary"
          icon={<Icon icon={addIcon} />}
        />
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
