import styled from '@emotion/styled';
import Button from '../Button';

interface EventModalContentProps {
  onConfirm: () => void;
}

export default function EventModalContent({ onConfirm }: EventModalContentProps) {
  return (
    <Wrapper>
      <Title>보상 획득!</Title>
      <ImageContainer>
        <Image
          src="https://picsum.photos/seed/eventitem/128"
          alt="획득한 아이템"
        />
      </ImageContainer>
      <Button
        label="확인"
        onClick={onConfirm}
        size="small"
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
`;

const Title = styled.h3`
  ${({ theme }) => theme.textStyles.H_B_24};
  margin: 0;
`;

const ImageContainer = styled.div`
  width: 128px;
  height: 128px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.gray[100]};
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
