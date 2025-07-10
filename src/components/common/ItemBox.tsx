import styled from '@emotion/styled';
import { Icon } from '@iconify/react';
import removeIcon from '@iconify-icons/material-symbols/remove';
import defaultImage from '../../assets/default.png';

interface ItemBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  imageURL: string;
  size?: 'fullwidth' | 'mini';
  equipped?: boolean;
  onUnequip?: () => void;
}

export default function ItemBox({ imageURL, size = 'fullwidth', equipped, onUnequip, ...props }: ItemBoxProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = defaultImage;
  };

  return (
    <Wrapper
      size={size}
      {...props}
    >
      <Image
        src={imageURL ? imageURL : defaultImage}
        alt="item"
        onError={handleImageError}
      />
      {equipped && size === 'fullwidth' && (
        <RemoveButton
          type="button"
          onClick={onUnequip}
        >
          <Icon icon={removeIcon} />
        </RemoveButton>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div<{ size: 'fullwidth' | 'mini' }>`
  ${({ size, theme }) => `
    position: relative;
    width: ${size === 'fullwidth' ? '100%' : '37px'};
    aspect-ratio: 1 / 1;
    padding: ${size === 'fullwidth' ? '12px' : '4px'};
    border: 1px solid ${theme.colors.black};
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: ${theme.colors.gray[100]};
    }
  `}
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const RemoveButton = styled.button`
  ${({ theme }) => `
    position: absolute;
    top: 4px;
    right: 4px;
    color: ${theme.colors.white};
    background: ${theme.colors.error[500]};
    border: none;
    border-radius: 4px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        color: ${theme.colors.white};
        width: 24px;
        height: 24px;
    }
  `}
`;
