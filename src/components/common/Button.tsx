import styled from '@emotion/styled';
import { css } from '@emotion/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
    variant?: "contained" | "outlined" | "texted";
    size?: "small" | "medium";
    icon?: React.ReactNode;
    fullWidth?: boolean;
    className?: string;
    color?: "primary" | "secondary" | "error" | "ghost";
}

const getVariantStyle = (theme: any, variant: string, color: string = 'primary') => {
  const colorMap = {
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    error: theme.colors.error,
    ghost: theme.colors.gray,
  };
  const selectedColor = colorMap[color as keyof typeof colorMap] || colorMap.primary;
  const isLightColor = color === 'ghost' || color === 'error';
  const baseColor = isLightColor ? 200 : 500;
  const hoverColor = isLightColor ? 300 : 600;

  switch (variant) {
    case 'contained':
      return css`
        background: ${selectedColor[baseColor]};
        color: ${isLightColor ? selectedColor[500] : theme.colors.white};
        border: none;
        &:hover:not(:disabled) {
          background: ${selectedColor[hoverColor]};
        }
      `;
    case 'outlined':
      return css`
        background: transparent;
        color: ${selectedColor[baseColor]};
        border: 1px solid ${selectedColor[baseColor]};
        &:hover:not(:disabled) {
          border: 1px solid ${selectedColor[hoverColor]};
        }
      `;
    case 'texted':
      return css`
        background: transparent;
        color: ${selectedColor[baseColor]};
        border: none;
        padding: 0;
        &:hover:not(:disabled) {
          background: ${selectedColor[200]};
          color: ${isLightColor ? selectedColor[500] : selectedColor[baseColor]};
        }
      `;
    default:
      return '';
  }
};

export const Button = ({ label, onClick, disabled, loading, variant = "contained", size = "medium", icon, fullWidth, className, color = "primary", ...props }: ButtonProps) => {
    const isIconOnly = !!icon && !label;
    const isIconWithLabel = !!icon && !!label;

    if (isIconOnly) {
        return (
            <IconButton
                onClick={onClick}
                disabled={disabled || loading}
                variant={variant}
                size={size}
                color={color}
                className={className}
                {...props}
            >
                {loading && <LoadingSpinner />}
                {icon && !loading && <IconWrapper>{icon}</IconWrapper>}
            </IconButton>
        );
    }

    return (
        <TextButton
            onClick={onClick}
            disabled={disabled || loading}
            variant={variant}
            size={size}
            fullWidth={fullWidth}
            isIconWithLabel={isIconWithLabel}
            color={color}
            className={className}
            {...props}
        >
            {loading && <LoadingSpinner />}
            {icon && !loading && <IconWrapper>{icon}</IconWrapper>}
            {label}
        </TextButton>
    );
};

const IconButton = styled.button<Pick<ButtonProps, 'variant' | 'size' | 'color'>>`
  ${({ theme, variant = 'contained', size = 'medium', color = 'primary' }) => {
    const iconSize = size === 'small' ? '42px' : '52px';
    return css`
      width: ${iconSize};
      height: ${iconSize};
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-size: 20px;
      ${getVariantStyle(theme, variant, color)}
      &:disabled {
        background: ${theme.colors.gray[100]};
        color: ${theme.colors.gray[300]};
        border: none;
      }
    `;
  }}
`;

const TextButton = styled.button<Pick<ButtonProps, 'variant' | 'size' | 'fullWidth' | 'color'> & { isIconWithLabel?: boolean }>`
  ${({ theme, variant = 'contained', size = 'medium', fullWidth, isIconWithLabel, color = 'primary' }) => {
    const sizeStyles = {
      small: css`
        ${theme.textStyles.L_SB_12};
        padding: ${isIconWithLabel ? '8px 12px' : '8px 16px'};
        border-radius: 8px;
        height: 42px;
        width: ${fullWidth ? '100%' : '88px'};
      `,
      medium: css`
        ${theme.textStyles.B_R_14};
        padding: ${isIconWithLabel ? '12px 16px' : '12px 24px'};
        border-radius: 8px;
        height: 48px;
        width: ${fullWidth ? '100%' : '168px'};
      `
    };
    return css`
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      position: relative;
      ${getVariantStyle(theme, variant, color)}
      ${sizeStyles[size]}
      &:disabled {
        background: ${theme.colors.gray[100]};
        color: ${theme.colors.gray[300]};
        border: none;
      }
    `;
  }}
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
  margin-right: 8px;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;