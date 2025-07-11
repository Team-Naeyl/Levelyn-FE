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
import { getMyPageData } from '../../services/myPage';
import type { TodoDTO } from '../../types/todo.types';
import type { GoalDTO } from '../../types/goal.types';
import { useAuth } from '../../contexts/AuthContext';
import { longPressHandler } from '../../utils/longPressHandler';
import {
  getTotalCount,
  incrementTotalCount,
  decrementTotalCount,
  incrementDailyStat,
  decrementDailyStat,
} from '../../utils/localStorage';
import homeBackground from '../../assets/home.png';

type CategoryType = '일반' | '목표';

interface TodoItemData {
  id: string;
  text: string;
  checked: boolean;
  category: CategoryType;
}

interface UserStatus {
  nickname: string;
  level: number;
  exp: number;
}

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
  const [todos, setTodos] = useState<TodoItemData[]>(() => {
    const cachedTodos = sessionStorage.getItem('todosCache');
    try {
      return cachedTodos ? JSON.parse(cachedTodos) : [];
    } catch (e) {
      return [];
    }
  });
  const [totalCompletedCount, setTotalCompletedCount] = useState(0);
  const [userStatus, setUserStatus] = useState<UserStatus>({ nickname: '...', level: 1, exp: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTotalCompletedCount(getTotalCount());
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

      const [todoResults, goalResult, myPageResult] = await Promise.allSettled([
        getDailyTodoList({ date: formattedDate }),
        getCurrentGoal(),
        getMyPageData(),
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
      sessionStorage.setItem('todosCache', JSON.stringify(combinedItems));

      // 사용자 정보 상태 업데이트
      if (myPageResult.status === 'fulfilled') {
        const { profile, character } = myPageResult.value;
        setUserStatus({
          nickname: profile.name,
          level: character.state.level,
          exp: character.state.exp,
        });
      } else {
        setError((prev) => (prev ? `${prev}, 사용자 정보 로딩 실패` : '사용자 정보를 불러오는데 실패했습니다.'));
      }
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

    const originalTodos = [...todos];
    setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? { ...todo, checked } : todo)));

    try {
      if (checked) {
        await fulfillTodo(Number(id));
        const newCount = incrementTotalCount();
        setTotalCompletedCount(newCount);
        incrementDailyStat();
      } else {
        // NOTE: 현재 API에서 미완료 처리를 지원하지 않지만, UI 일관성을 위해 카운트를 줄입니다.
        const newCount = decrementTotalCount();
        setTotalCompletedCount(newCount);
        decrementDailyStat();
      }
    } catch (err) {
      console.error('Todo 상태 변경에 실패했습니다:', err);
      setTodos(originalTodos);
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

    const sortedTodos = [...todos].sort((a, b) => Number(a.checked) - Number(b.checked));

    return sortedTodos.map((todo) => (
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
      <BackgroundImage />
      <Header />
      <UserInfo>
        <NameLevelRow>
          <span>{userStatus.nickname}</span>
          <Level>Lv. {userStatus.level}</Level>
        </NameLevelRow>
        <ProgressBar
          variant="exp"
          label="EXP"
          total={100}
          current={userStatus.exp}
          width={160}
          height={16}
        />
      </UserInfo>
      <Content>
        <TileMap totalCompletedCount={totalCompletedCount} />
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

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${homeBackground});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  filter: grayscale(100%);
  opacity: 0.2;
  z-index: 0;
`;

const UserInfo = styled.div`
  position: absolute;
  top: 100px;
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
  font-weight: 600;
`;

const Level = styled.span`
  ${({ theme }) => theme.textStyles.B_R_14};
  font-weight: 600;
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
