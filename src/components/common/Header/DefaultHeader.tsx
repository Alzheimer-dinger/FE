import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { IoSearch } from 'react-icons/io5';
import Logo from '@assets/logo.svg?react';

interface HeaderProps {
  showIcon?: boolean;
}

const DefaultHeader = ({ showIcon = true }: HeaderProps) => {
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/call-search');
  };

  return (
    <HeaderContainer>
      <Logo />
      {showIcon && (
        <IconWrapper onClick={handleSearchClick}>
          <IoSearch size={24} color="#38006B" />
        </IconWrapper>
      )}
    </HeaderContainer>
  );
};

export default DefaultHeader;

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

const IconWrapper = styled.div`
  position: absolute;
  right: 1rem;
  cursor: pointer;
`;
