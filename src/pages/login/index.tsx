import Button from '../../components/common/Button';
import styled from '@emotion/styled';
import { API_BASE_URL } from '../../services/api';

export default function Login() {
  const handleLogin = () => {
    window.location.href = `${API_BASE_URL}/api/auth/sign-in`;
  };

  return (
    <Container>
      <Logo>Levelyn</Logo>
      <ButtonWrapper>
        <Button
          label="카카오로 시작하기"
          onClick={handleLogin}
          fullWidth
        />
      </ButtonWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 0 20px;
`;

const Logo = styled.div`
  ${({ theme }) => theme.textStyles.H_B_32}
  margin-bottom: 150px;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  max-width: 320px;
  position: absolute;
  bottom: 50px;
`;
