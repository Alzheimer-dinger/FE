import styled from 'styled-components';

const FooterMenu = () => {
  return (
    <FooterContainer>
      <MenuItem>통화</MenuItem>
      <MenuItem>리포트</MenuItem>
      <MenuItem>마이페이지</MenuItem>
    </FooterContainer>
  );
};

export default FooterMenu;

const FooterContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  max-width: 425px;
  background: #fff;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 56px;
  z-index: 100;
`;

const MenuItem = styled.div`
  font-size: 1rem;
  color: #6c3cff;
  font-weight: 500;
`; 