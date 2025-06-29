import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { kakaoLogin } from '../../services/auth';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';

export default function KakaoCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const isLoginInProgress = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');

    const handleLogin = async (loginCode: string) => {
      try {
        const { accessToken } = await kakaoLogin(loginCode);
        login(accessToken);
        navigate('/');
      } catch (err) {
        console.error('카카오 로그인 처리 중 오류 발생:', err);
        setError('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    };

    if (code && !isLoginInProgress.current) {
      isLoginInProgress.current = true;
      handleLogin(code);
    } else if (!code) {
      setError('인증 코드가 없습니다. 로그인 페이지로 돌아갑니다.');
      setTimeout(() => navigate('/login'), 3000);
    }
  }, []);

  if (error) {
    return (
      <Container>
        <Message>{error}</Message>
        <Button
          label="로그인으로 돌아가기"
          onClick={() => navigate('/login')}
          variant="contained"
          color="primary"
        />
      </Container>
    );
  }

  return (
    <Container>
      <Message>카카오 로그인 처리 중입니다...</Message>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 20px;
`;

const Message = styled.div`
  ${({ theme }) => theme.textStyles.B_R_16};
`;
