import { useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Icon } from '@iconify/react';
import arrowUpIcon from '@iconify-icons/material-symbols/keyboard-arrow-up';
import arrowDownIcon from '@iconify-icons/material-symbols/keyboard-arrow-down';

interface DropdownProps {
  fullWidth?: boolean;
  placeholder?: string;
  loading?: boolean;
  options: {
    label: string;
    value: unknown;
  }[];
  onChange?: (value: unknown) => void;
}

export default function Dropdown({
  fullWidth,
  placeholder = '선택하세요',
  loading,
  options = [],
  onChange,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<{ label: string; value: unknown } | undefined>(undefined);

  const handleSelect = (option: { label: string; value: unknown }) => {
    setSelected(option);
    setIsOpen(false);
    onChange?.(option.value);
  };

  return (
    <Wrapper fullWidth={fullWidth}>
      <Trigger
        onClick={() => setIsOpen((prev) => !prev)}
        isPlaceholder={!selected?.label}
      >
        <span>{selected?.label || placeholder}</span>
        <ArrowIcon
          icon={isOpen ? arrowUpIcon : arrowDownIcon}
          isOpen={isOpen}
        />
      </Trigger>
      {isOpen && !loading && (
        <List>
          {options.map((option) => (
            <Item
              key={'label' + `${option.value}`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </Item>
          ))}
        </List>
      )}
      {isOpen && loading && <LoadingItem>로딩 중...</LoadingItem>}
    </Wrapper>
  );
}

const Wrapper = styled.div<{ fullWidth?: boolean }>`
  position: relative;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '154px')};
`;

const Trigger = styled.button<{ isPlaceholder?: boolean }>`
  ${({ theme, isPlaceholder }) => css`
    width: 100%;
    padding: 14px 20px;
    border: 1px solid ${theme.colors.gray[300]};
    border-radius: 8px;
    background: white;
    color: ${isPlaceholder ? `${theme.colors.gray[300]}` : `${theme.colors.black}`};
    ${theme.textStyles.B_R_14}
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border: 2px solid ${theme.colors.primary[700]};
    }
  `}
`;

const ArrowIcon = styled(Icon, {
  shouldForwardProp: (prop) => !['isOpen'].includes(prop),
})<{ isOpen: boolean }>`
  ${({ theme, isOpen }) => css`
    margin-left: 8px;
    font-size: 20px;
    color: ${isOpen ? theme.colors.primary[700] : theme.colors.black};
    transition: color 0.2s ease-in-out;
  `}
`;

const List = styled.ul`
  ${({ theme }) => css`
    position: absolute;
    top: calc(100%);
    width: 100%;
    border: 1px solid ${theme.colors.gray[200]};
    background: ${theme.colors.white};
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    z-index: 10;
  `}
`;

const Item = styled.li`
  ${({ theme }) => css`
    padding: 10px 20px;
    cursor: pointer;
    z-index: 10;

    ${theme.textStyles.L_SB_12};

    &:not(:first-of-type) {
      border-top: 1px solid ${theme.colors.gray[200]};
    }
    &:hover {
      background: ${theme.colors.gray[100]};
    }
  `}
`;

const LoadingItem = styled.div`
  ${({ theme }) => css`
    position: absolute;
    top: calc(100%);
    width: 100%;
    border: 1px solid ${theme.colors.gray[200]};
    ${theme.textStyles.L_SB_12};
    border-radius: 8px;
    padding: 10px 20px;
    cursor: not-allowed;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    z-index: 10;
  `}
`;
