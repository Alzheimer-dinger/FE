import styled from 'styled-components';

interface TabMenuProps {
  tabs: string[];
  activeTab: string;
  // eslint-disable-next-line no-unused-vars
  onTabChange: (tab: string) => void;
}

/**
 * TabMenu - 탭 메뉴 컴포넌트
 *
 * @param tabs - 탭 목록
 * @param activeTab - 현재 활성화된 탭
 * @param onTabChange - 탭 변경 핸들러
 */
const TabMenu = ({ tabs, activeTab, onTabChange }: TabMenuProps) => {
  return (
    <TabContainer>
      {tabs.map(tab => (
        <TabButton
          key={tab}
          $active={activeTab === tab}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </TabButton>
      ))}
    </TabContainer>
  );
};

export default TabMenu;

// Styled Components
const TabContainer = styled.div`
  display: flex;
  background: #f5f5f5;
  border-radius: 999px;
  padding: 6px;
  width: 90%;
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px 18px;
  border: none;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? '#6c3cff' : 'transparent')};
  color: ${({ $active }) => ($active ? 'white' : '#666')};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ $active }) => ($active ? '#6c3cff' : '#e0e0e0')};
  }
`;
