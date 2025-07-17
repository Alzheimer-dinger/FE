import styled from 'styled-components';
import { IoArrowBackOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showIcon?: boolean;
  onClick?: () => void;
}

const BackHeader = ({ title }: HeaderProps) => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <HeaderContainer>
      <IoArrowBackOutline
        color="#38006B"
        size={24}
        onClick={handleBack}
        style={{ cursor: 'pointer', marginLeft: '1rem' }}
      />
      <Title>{title}</Title>
    </HeaderContainer>
  );
};

export default BackHeader;

const HeaderContainer = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
`;

const Title = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.2rem;
  font-weight: bold;
  color: #38006b;
`;
