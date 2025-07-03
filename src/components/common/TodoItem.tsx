import styled from '@emotion/styled';
import { css } from '@emotion/react';
import Checkbox from './CheckBox';

type CategoryType = '일반' | '목표';

interface TodoItemProps {
  id: string;
  text: string;
  checked: boolean;
  category?: CategoryType;
  onCheck: (checked: boolean) => void;
}

const categoryColors = {
  일반: {
    background: '#FFFFFF',
    border: '#1B1F24',
  },
  목표: {
    background: '#FFF9C4',
    border: '#FFC107',
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
