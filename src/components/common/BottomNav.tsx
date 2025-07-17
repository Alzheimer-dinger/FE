import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FiPieChart, FiUser } from 'react-icons/fi';
import { PiPhoneCallFill } from 'react-icons/pi';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.pathname.substring(1) || 'call',
  );

  useEffect(() => {
    setActiveTab(location.pathname.substring(1) || 'call');
  }, [location.pathname]);

  const handleNavClick = (tab: string, path: string) => {
    setActiveTab(tab);
    navigate(path);
  };

  return (
    <Wrapper>
      <NavBar>
        <NavItem
          active={activeTab === 'call'}
          onClick={() => handleNavClick('call', '/call')}
        >
          <PiPhoneCallFill size={24} />
          통화
        </NavItem>
        <NavItem
          active={activeTab === 'report'}
          onClick={() => handleNavClick('report', '/report')}
        >
          <FiPieChart size={24} />
          리포트
        </NavItem>
        <NavItem
          active={activeTab === 'mypage'}
          onClick={() => handleNavClick('mypage', '/mypage')}
        >
          <FiUser size={24} />
          마이페이지
        </NavItem>
      </NavBar>
    </Wrapper>
  );
};

export default BottomNav;

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 425px;
  z-index: 10;
  background-color: #fff;
  box-shadow: 0 -2px 3px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
`;

const NavItem = styled.div.withConfig({
  shouldForwardProp: prop => prop !== 'active',
})<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  color: ${props => (props.active ? '#6a1b9a' : '#d9d9d9')};
  font-size: 0.5rem;
  font-weight: bold;
  gap: 5px;
  cursor: pointer;
`;
