import { useState } from 'react';
import styled from '@emotion/styled';

import Drawer from '../../components/common/Drawer';
import TodoItem from '../../components/common/TodoItem';
import ProgressBar from '../../components/common/ProgressBar';
import TileMap from '../../components/common/tilemap';

const mockTodos = [
  { id: '1', text: '프로젝트 초기 설정하기', checked: true, category: '업무' as const },
  { id: '2', text: '컴포넌트 라이브러리 조사', checked: true, category: '업무' as const },
  { id: '3', text: '디자인 시스템 정의', checked: false, category: '업무' as const },
  { id: '4', text: '운동하기', checked: false, category: '운동' as const },
  { id: '5', text: '장보기', checked: true, category: '생활' as const },
];

const mockUser = {
  name: '레벨린',
  level: 5,
  exp: 75,
  maxExp: 100,
};

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [todos, setTodos] = useState(mockTodos);

  const handleToggleDrawer = (isOpen: boolean) => {
    setIsDrawerOpen(isOpen);
  };

  const handleAddTodo = () => {
    console.log('Add new todo');
  };

  const handleCheckTodo = (id: string, checked: boolean) => {
    setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? { ...todo, checked } : todo)));
  };

  return (
    <Container>
      <Header>
        <span>임시 헤더</span>
      </Header>
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
        <TileMap />
      </Content>
      <Drawer
        isOpen={isDrawerOpen}
        onToggle={handleToggleDrawer}
        onAdd={handleAddTodo}
        itemCount={todos.length}
      >
        <TodoList>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              {...todo}
              onCheck={(checked) => handleCheckTodo(todo.id, checked)}
            />
          ))}
        </TodoList>
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

const Header = styled.header`
  height: 60px;
  padding: 0 20px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #e0e0e0;
`;

const UserInfo = styled.div`
  position: absolute;
  top: 72px;
  right: 20px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NameLevelRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-left: 9px;
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
