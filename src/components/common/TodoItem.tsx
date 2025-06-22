import styled from '@emotion/styled';
import { css } from '@emotion/react';
import Checkbox from './CheckBox';

type CategoryType = '공부' | '운동' | '업무' | '생활' | '기타';

interface TodoItemProps {
  id: string;
  text: string;
  checked: boolean;
  category?: CategoryType;
  onCheck: (checked: boolean) => void;
}

// 카테고리별 파스텔 색상 정의(임시)
const categoryColors = {
  공부: {
    background: '#F0FFE4', // 연한 민트 그린
    border: '#4CAF50', // 그린
  },
  운동: {
    background: '#E0FFF5', // 연한 블루
    border: '#2196F3', // 블루
  },
  업무: {
    background: '#FFF3E0', // 연한 오렌지
    border: '#FF9800', // 오렌지
  },
  생활: {
    background: 'white', // 연한 핑크
    border: 'black', // 핑크
  },
  기타: {
    background: 'white', // 연한 핑크
    border: 'black', // 핑크
  },
};

export default function TodoItem({ id, text, checked, category, onCheck }: TodoItemProps) {
  return (
    <ItemWrapper category={category}>
      <Checkbox
        checked={checked}
        onChange={onCheck}
      />
      <ItemText checked={checked}>{text}</ItemText>
      {category && <CategoryLabel category={category}>{category}</CategoryLabel>}
    </ItemWrapper>
  );
}

const ItemWrapper = styled.div<{ category?: CategoryType }>`
  ${({ theme, category }) => css`
    width: 100%;
    height: 54px;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    border: 2px solid ${theme.colors.black};
    border-radius: 4px;
    background: ${category ? categoryColors[category].background : theme.colors.white};
    cursor: pointer;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  `}
`;

const ItemText = styled.span<{ checked: boolean }>`
  ${({ theme, checked }) => css`
    flex: 1;
    ${theme.textStyles.B_R_14};
    color: ${theme.colors.black};
    text-decoration: ${checked ? 'line-through' : 'none'};
    opacity: ${checked ? 0.6 : 1};
    transition:
      opacity 0.2s,
      text-decoration 0.2s;
  `}
`;

const CategoryLabel = styled.span<{ category: CategoryType }>`
  ${({ theme, category }) => css`
    ${theme.textStyles.L_SB_12};
    color: ${categoryColors[category].border};
    padding: 4px 8px;
    border-radius: 12px;
    border: 2px solid ${categoryColors[category].border};
  `}
`;
