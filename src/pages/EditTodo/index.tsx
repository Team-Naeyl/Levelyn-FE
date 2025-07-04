import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Header from '../../components/common/Header';
import TextField from '../../components/common/TextField';
import Button from '../../components/common/Button';
import { Icon } from '@iconify/react';
import addIcon from '@iconify-icons/material-symbols/add';
import Dropdown from '../../components/common/Dropdown';

import { updateTodo, deleteTodo } from '../../services/todo';
import type { PatchTodoQuery, EditTodoDTO } from '../../types/todo.types';

type PeriodType = '매주' | '2주' | '한달';

export default function EditTodo() {
  const location = useLocation();
  const navigate = useNavigate();

  const todo = location.state?.todo as EditTodoDTO | undefined;
  const descriptionRef = useRef<HTMLInputElement>(null);
  const [period, setPeriod] = useState<PeriodType | undefined>();
  const periodOptions: PeriodType[] = ['매주', '2주', '한달'];
  const [isSub, setIsSub] = useState<boolean>(todo?.category === '목표' ? true : false);
  const subOptions = [
    { label: '일반', value: false },
    { label: '목표', value: true },
  ];
  const getKstDateString = (): string => {
    const now = new Date();
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    return kst.toISOString().slice(0, 10);
  };

  const handleDelete = async () => {
    if (!todo) return;
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteTodo(parseInt(todo.id));
      navigate(-1);
    } catch (err) {
      alert('삭제 실패');
      console.error('할 일 삭제 실패:', err);
    }
  };

  const handlePeriod = (option: PeriodType) => {
    setPeriod((prev) => (prev === option ? undefined : option));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!todo) return;

    const description = descriptionRef.current?.value.trim();
    if (!description) {
      alert('할 일의 내용을 입력해주세요.');
      return;
    }
    const payload: PatchTodoQuery = {
      description,
      date: getKstDateString(),
      isSub,
    };

    if (period) {
      const amount = period === '2주' ? 2 : 1;
      const unit = period === '한달' ? 'months' : 'weeks';
      payload.period = { unit, amount };
    }
    try {
      await updateTodo(parseInt(todo.id), payload);
      navigate(-1);
    } catch (err) {
      alert('수정 실패');
      console.error('할 일 수정 실패:', err);
    }
  };

  return (
    <>
      <Header
        isMain={false}
        title={'할 일 수정'}
        onBack={() => navigate(-1)}
        onDelete={handleDelete}
      />
      <Main>
        <TextField
          placeholder="할 일을 입력해주세요"
          ref={descriptionRef}
          defaultValue={todo?.text || ''}
        />
        <Dropdown
          options={subOptions}
          fullWidth={true}
          placeholder="일반"
          onChange={(value) => setIsSub(Boolean(value))}
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
          label="수정하기"
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
