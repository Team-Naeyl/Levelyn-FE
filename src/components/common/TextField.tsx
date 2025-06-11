import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Icon } from '@iconify/react';
import errorIcon from '@iconify-icons/material-symbols/error';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  variant?: 'primary' | 'secondary';
}

export const TextField = ({ label, error, variant, ...props }: TextFieldProps) => {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <InputWrapper
        error={error}
        variant={variant}
      >
        <Input {...props} />
        {error && <ErrorIcon icon={errorIcon} />}
      </InputWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 344px;
`;

const Label = styled.label`
  ${({ theme }) => css`
    ${theme.textStyles.L_SB_12};
    color: ${theme.colors.gray[400]};
    padding-left: 8px;
  `}
`;

const InputWrapper = styled.div<Pick<TextFieldProps, 'error' | 'variant'>>`
  ${({ theme, error, variant }) => {
    const borderColor = error ? theme.colors.error[500] : variant ? theme.colors[variant][500] : theme.colors.gray[400];
    const borderWidth = variant ? '2px' : '1px';
    const background = error ? theme.colors.error[100] : 'transparent';

    return css`
      width: 100%;
      display: flex;
      flex-direction: row;
      gap: 8px;
      border-radius: 8px;
      padding: 16px;
      transition: all 0.2s ease-in-out;
      border: ${borderWidth} solid ${borderColor};
      background: ${background};

      ${!error &&
      !variant &&
      css`
        &:focus-within {
          border-color: ${theme.colors.primary[500]};
        }
      `}
    `;
  }}
`;

const Input = styled.input`
  ${({ theme }) => css`
    width: 100%;
    ${theme.textStyles.B_R_14};
    color: ${theme.colors.black};
    outline: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &::placeholder {
      color: ${theme.colors.gray[400]};
    }
  `}
`;

const ErrorIcon = styled(Icon)`
  ${({ theme }) => css`
    color: ${theme.colors.error[500]};
    font-size: 16px;
  `}
`;
