import styled from 'styled-components';
import { useState } from 'react';
import {
  DefaultHeader,
  BottomNav,
  ContentContainer,
  TabMenu,
} from '@components/index';
import DailySection from './DailySection';
import TotalSection from './TotalSection';

const Report = () => {
  const [activeTab, setActiveTab] = useState('일간');

  const tabs = ['일간', '종합'];

  return (
    <Container>
      <DefaultHeader showIcon={false} />
      <ContentContainer navMargin={true}>
        {/* Tab Menu */}
        <TabMenu tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === '일간' && <DailySection />}
        {activeTab === '종합' && <TotalSection />}
      </ContentContainer>
      <BottomNav />
    </Container>
  );
};

export default Report;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
