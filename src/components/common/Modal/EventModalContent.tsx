import styled from '@emotion/styled';
import Button from '../Button';
import { type ReactNode } from 'react';

interface EventModalContentProps {
  onConfirm: () => void;
  title: string;
  description: ReactNode;
  imageUrl?: string;
}

export default function EventModalContent({ onConfirm, title, description, imageUrl }: EventModalContentProps) {
  return (
    <Container>
      <Title>{title}</Title>
      {imageUrl && (
        <ImageContainer>
          <Image
            src={imageUrl}
            alt={title}
          />
        </ImageContainer>
      )}
      <Description>{description}</Description>
      <Button
        label="확인"
        onClick={onConfirm}
        fullWidth
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px;
`;

const Title = styled.h2`
  ${({ theme }) => theme.textStyles.H_B_20};
`;

const ImageContainer = styled.div`
  margin-top: 16px;
  width: 128px;
  height: 128px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const Description = styled.div`
  ${({ theme }) => theme.textStyles.B_R_14};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[600]};
  white-space: pre-wrap;
  text-align: center;
  margin-bottom: 16px;
`;
