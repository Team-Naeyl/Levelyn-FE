import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Icon } from '@iconify/react';
import checkIcon from '@iconify-icons/material-symbols/check';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Checkbox = ({ checked, onChange, disabled }: CheckboxProps) => (
  <CheckboxWrapper
    checked={checked}
    disabled={disabled}
    onClick={() => !disabled && onChange(!checked)}
    tabIndex={0}
  >
    {checked && <CheckIcon icon={checkIcon} />}
  </CheckboxWrapper>
);

const CheckboxWrapper = styled.button<{ checked: boolean; disabled?: boolean }>`
  ${({ theme, checked, disabled }) => css`
    width: 18px;
    height: 18px;
    border: 2px solid ${checked ? theme.colors.gray[400] : theme.colors.black};
    background: ${checked ? theme.colors.gray[100] : theme.colors.white};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
    opacity: ${disabled ? 0.5 : 1};
    outline: none;
    padding: 0;
  `}
`;

const CheckIcon = styled(Icon)`
  ${({ theme }) => css`
    color: ${theme.colors.gray[400]};
    font-size: 16px;
  `}
`;
