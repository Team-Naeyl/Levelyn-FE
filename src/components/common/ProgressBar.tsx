import styled from '@emotion/styled';
import { css } from '@emotion/react';

interface ProgressBarProps {
  variant: 'exp' | 'timer';
  label: string;
  total: number;
  current: number;
  width: number | string;
  height: number;
}

export default function ProgressBar({ variant, label, total, current, width, height }: ProgressBarProps) {
  const progressPercentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <Container width={width}>
      {label && <Label>{label}</Label>}
      <Wrapper
        height={height}
        variant={variant}
      >
        <Progress
          variant={variant}
          style={{ width: `${progressPercentage}%` }}
        />
        <Percentage>{Math.round(progressPercentage)}%</Percentage>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div<{ width: number | string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width)};
`;

const Label = styled.label`
  ${({ theme }) => css`
    ${theme.textStyles.L_SB_12};
    color: ${theme.colors.black};
    width: 36px;
    text-align: left;
    white-space: nowrap;
    flex-shrink: 0;
  `}
`;

const Wrapper = styled.div<Pick<ProgressBarProps, 'height' | 'variant'>>`
  ${({ theme, height, variant }) => css`
    position: relative;
    flex: 1;
    height: ${`${height}px`};
    border: 2px solid ${theme.colors.black};
    overflow: hidden;
    background-color: ${variant === 'exp' ? theme.colors.error[200] : theme.colors.gray[200]};
  `}
`;

const Progress = styled.div<Pick<ProgressBarProps, 'variant'>>`
  ${({ theme, variant }) => css`
    height: 100%;
    background-color: ${variant === 'exp' ? theme.colors.error[500] : theme.colors.gray[500]};
    transition: width 0.3s ease-in-out;
  `}
`;

const Percentage = styled.span`
  ${({ theme }) => css`
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    ${theme.textStyles.L_SB_12};
    color: ${theme.colors.black};
  `}
`;
