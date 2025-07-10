import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

import Drawer from '../../components/common/Drawer';
import TodoItem from '../../components/common/TodoItem';
import ProgressBar from '../../components/common/ProgressBar';
import TileMap from '../../components/common/tilemap';
import Header from '../../components/common/Header';
import { getDailyTodoList, fulfillTodo } from '../../services/todo';
import { getCurrentGoal } from '../../services/goal';
import type { TodoDTO } from '../../types/todo.types';
import type { GoalDTO } from '../../types/goal.types';
import { useAuth } from '../../contexts/AuthContext';
import { longPressHandler } from '../../utils/longPressHandler';

type CategoryType = '일반' | '목표';

interface TodoItemData {
  id: string;
  text: string;
  checked: boolean;
  category: CategoryType;
}

const mockUser = {
  name: '레벨린',
  level: 5,
  exp: 75,
  maxExp: 100,
};

// TodoDTO를 TodoItem props로 변환하는 함수
const transformTodoData = (apiTodo: TodoDTO): TodoItemData => {
  const category: CategoryType = apiTodo.isSub ? '목표' : '일반';

  return {
    id: apiTodo.id.toString(),
    text: apiTodo.description || '',
    checked: apiTodo.completed,
    category,
  };
};

// GoalDTO를 TodoItem props로 변환하는 함수
const transformGoalData = (apiGoal: GoalDTO): TodoItemData => {
  return {
    id: `goal-${apiGoal.id}`,
    text: apiGoal.content,
    checked: false,
    category: '목표',
  };
};

export default function Home() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [isDrawerOpen, setIsDrawerOpen] = useState(() => sessionStorage.getItem('drawerState') === 'open');
  const [todos, setTodos] = useState<TodoItemData[]>([]);
  const [mapTodos, setMapTodos] = useState<TodoItemData[]>([]); // 타일맵을 위한 상태
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cumulativeCompletedCount = parseInt(localStorage.getItem('cumulativeCompletedCount') || '0', 10);
    const fakeCompletedTodos = Array.from({ length: cumulativeCompletedCount }, (_, i) => ({
      id: `fake-${i}`,
      text: '',
      checked: true,
      category: '일반' as CategoryType,
    }));
    setMapTodos(fakeCompletedTodos);
  }, []);

  const fetchAllItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!isLoggedIn) {
        return;
      }

      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const [todoResults, goalResult] = await Promise.allSettled([
        getDailyTodoList({ date: formattedDate }),
        getCurrentGoal(),
      ]);

      // 오늘 할 일 목록 상태 업데이트
      const combinedItems: TodoItemData[] = [];
      if (todoResults.status === 'fulfilled') {
        const transformedTodos = todoResults.value.map(transformTodoData);
        combinedItems.push(...transformedTodos);
      } else {
        setError('Todo 목록을 불러오는데 실패했습니다.');
      }
      if (goalResult.status === 'fulfilled' && goalResult.value) {
        const transformedGoal = transformGoalData(goalResult.value);
        combinedItems.push(transformedGoal);
      }
      setTodos(combinedItems);
    } catch (err) {
      setError('데이터를 불러오는 중 알 수 없는 에러가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchAllItems();
  }, [fetchAllItems]);

  useEffect(() => {
    sessionStorage.setItem('drawerState', isDrawerOpen ? 'open' : 'closed');
  }, [isDrawerOpen]);

  const handleToggleDrawer = (isOpen: boolean) => {
    setIsDrawerOpen(isOpen);
  };

  const handleAddTodo = () => {
    navigate('/todo/create');
  };

  const handleCheckTodo = async (id: string, checked: boolean) => {
    if (id.startsWith('goal-')) {
      return;
    }

    try {
      setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? { ...todo, checked } : todo)));

      if (checked) {
        await fulfillTodo(parseInt(id));
        const currentCount = parseInt(localStorage.getItem('cumulativeCompletedCount') || '0', 10);
        const newCount = currentCount + 1;
        localStorage.setItem('cumulativeCompletedCount', newCount.toString());

        setMapTodos((prevMapTodos) => [
          ...prevMapTodos,
          { id: `fake-${newCount}`, text: '', checked: true, category: '일반' as CategoryType },
        ]);
      } else {
        console.warn('Todo 미완료 처리는 현재 지원되지 않습니다.');
      }
    } catch (err) {
      console.error('Todo 상태 변경에 실패했습니다:', err);

      setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? { ...todo, checked: !checked } : todo)));
      setError('Todo 상태 변경에 실패했습니다.');
    }
  };

  const handleTodoLongPress = (todo?: TodoItemData) => {
    navigate('/todo/edit', { state: { todo } });
  };

  const renderTodoList = () => {
    if (isLoading) {
      return <LoadingText>Todo 목록을 불러오는 중...</LoadingText>;
    }

    if (error) {
      return (
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
          <RetryButton onClick={() => window.location.reload()}>다시 시도</RetryButton>
        </ErrorContainer>
      );
    }

    if (todos.length === 0) {
      return <EmptyText>오늘 등록된 Todo가 없습니다.</EmptyText>;
    }

    return todos.map((todo) => (
      <div
        key={todo.id}
        {...longPressHandler(handleTodoLongPress, todo, 800)}
      >
        <TodoItem
          {...todo}
          onCheck={handleCheckTodo}
        />
      </div>
    ));
  };

  return (
    <Container>
      <Header />
      <UserInfo>
        <NameLevelRow>
          <span>{mockUser.name}</span>
          <Level>Lv. {mockUser.level}</Level>
        </NameLevelRow>
        <ProgressBar
          variant="exp"
          label="EXP"
          total={mockUser.maxExp}
          current={mockUser.exp}
          width={160}
          height={16}
        />
      </UserInfo>
      <Content>
        <TileMap todos={mapTodos} />
      </Content>
      <Drawer
        isOpen={isDrawerOpen}
        onToggle={handleToggleDrawer}
        onAdd={handleAddTodo}
        itemCount={todos.length}
      >
        <TodoList>{renderTodoList()}</TodoList>
      </Drawer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const UserInfo = styled.div`
  position: absolute;
  top: 72px;
  right: 20px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 8px;
`;

const NameLevelRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Level = styled.span`
  ${({ theme }) => theme.textStyles.B_R_14};
`;

const Content = styled.main`
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 100px;
`;

const TodoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LoadingText = styled.div`
  ${({ theme }) => theme.textStyles.B_R_14};
  color: #6e7781;
  text-align: center;
  padding: 20px;
`;

const ErrorText = styled.div`
  ${({ theme }) => theme.textStyles.B_R_14};
  color: #fa4549;
  text-align: center;
  padding: 20px;
`;

const EmptyText = styled.div`
  ${({ theme }) => theme.textStyles.B_R_14};
  color: #6e7781;
  text-align: center;
  padding: 20px;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
`;

const RetryButton = styled.button`
  ${({ theme }) => theme.textStyles.B_R_14};
  background-color: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[600]};
  }
`;
