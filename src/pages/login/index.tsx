import styled from '@emotion/styled';
import Button from '../../components/common/Button';
import { css } from '@emotion/react';
import logoImage from '../../assets/logo.png';
import splashImage from '../../assets/splash.png';

export default function Login() {
  const handleLogin = () => {
    const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
    const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

    if (!KAKAO_REST_API_KEY || !REDIRECT_URI) {
      alert('카카오 로그인 설정 오류');
      console.error('카카오 로그인 설정 오류');
      return;
    }

    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoURL;
  };

  return (
    <Container imageUrl={splashImage}>
      <Logo
        src={logoImage}
        alt="Levelyn Logo"
      />
      <ButtonContainer>
        <Button
          label="카카오로 시작하기"
          color="primary"
          onClick={handleLogin}
          fullWidth
        />
      </ButtonContainer>
    </Container>
  );
}

const Container = styled.div<{ imageUrl: string }>`
  ${({ theme, imageUrl }) => css`
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    background-color: ${theme.colors.white};

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 40%;
      background-image: ${imageUrl ? `url(${imageUrl})` : 'none'};
      background-size: cover;
      background-position: center bottom;
      background-repeat: no-repeat;
      filter: grayscale(10%);
      transition: background-image 0.3s ease-in-out;
    }
  `}
`;

const Logo = styled.img`
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  width: 400px;
`;

const ButtonContainer = styled.div`
  width: calc(100% - 40px);
  max-width: 440px;
  position: absolute;
  bottom: 80px;
  z-index: 1;
`;
