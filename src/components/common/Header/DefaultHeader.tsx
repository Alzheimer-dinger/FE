import styled from 'styled-components';
import { IoSearch } from 'react-icons/io5';
import Logo from '@assets/logo.svg?react';

interface HeaderProps {
  showIcon?: boolean;
  onSetting?: () => void;
}

const DefaultHeader = ({ showIcon = true, onSetting }: HeaderProps) => {
  return (
    <HeaderContainer>
      <Logo />
      {showIcon && (
        <IconWrapper onClick={onSetting}>
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
