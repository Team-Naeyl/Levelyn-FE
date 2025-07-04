import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Header from '../../components/common/Header';
import errorImage from '../../assets/errorimage.png';

export default function ErrorPage() {
  const navigate = useNavigate();
  const [sec, setSec] = useState(5);

  useEffect(() => {
    if (sec === 0) {
      navigate('/', { replace: true });
      return;
    }
    const timer = setTimeout(() => setSec((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [sec, navigate]);

  return (
    <>
      <Header isMain={true} />
      <Wrapper>
        <Image
          src={errorImage}
          alt="에러 이미지"
        />
        <MainText>존재하지 않는 페이지입니다.</MainText>
        <SubText>
          <span> </span>
          <Second>{sec}</Second>
          <span>초 후 메인 화면으로 이동합니다.</span>
        </SubText>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const Image = styled.img`
  width: 256px;
  height: auto;
  user-drag: none;
  user-select: none;
`;

const MainText = styled.div`
  ${({ theme }) => theme.textStyles.T_SB_20};
  color: ${({ theme }) => theme.colors.black};
`;

const SubText = styled.div`
  ${({ theme }) => theme.textStyles.B_R_18};
  color: ${({ theme }) => theme.colors.black};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Second = styled.span`
  color: ${({ theme }) => theme.colors.primary[700]};
  ${({ theme }) => theme.textStyles.B_R_18};
`;
