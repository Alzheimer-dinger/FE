import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DefaultHeader,
  BottomNav,
  ContentContainer,
  TabMenu,
} from '@components/index';
import DailySection from './DailySection';
import TotalSection from './TotalSection';
import { IoSettingsSharp } from 'react-icons/io5';
import { getUserProfile, getRelations, type Relation } from '@services/api';
import Loading from '@pages/Loading';

const Report = () => {
  const [activeTab, setActiveTab] = useState('일간');
  const [showConnections, setShowConnections] = useState(false);
  const [me, setMe] = useState<{ name: string; imageUrl?: string } | null>(
    null,
  );
  const [relations, setRelations] = useState<Relation[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await getUserProfile();
        setMe({ name: profile.name, imageUrl: profile.imageUrl });
      } catch {}
      try {
        const list = await getRelations();
        setRelations(list);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Ensure query params (date, userId) default to today & my userId
  useEffect(() => {
    const ensureQuery = async () => {
      const params = new URLSearchParams(location.search);
      const hasDate = !!params.get('date');
      const hasUser = !!params.get('userId');
      if (hasDate && hasUser) return;
      // compute defaults
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const date = `${yyyy}-${mm}-${dd}`;
      let userId: string | undefined = undefined;
      try {
        const profile = await getUserProfile();
        // 서버 요구사항: 내 userId를 userId 파라미터로 전송
        userId = profile.userId;
      } catch {}
      if (!hasDate) params.set('date', date);
      if (!hasUser && userId) params.set('userId', userId);
      if (!hasDate || !hasUser) {
        navigate(`/report?${params.toString()}`, { replace: true });
      }
    };
    ensureQuery();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const tabs = ['일간', '종합'];

  return (
    <Container>
      <DefaultHeader showIcon={false} />
      <ContentContainer navMargin={true} style={{ width: '100%', padding: '0.5rem 1rem' }}>
        {/* Tab Menu + Settings */}
        <TopBar>
          <TabMenu
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <GearBtn
            onClick={() => setShowConnections(true)}
            aria-label="연결 보기"
          >
            <IoSettingsSharp size={22} color="#38006B" />
          </GearBtn>
        </TopBar>

        {activeTab === '일간' && <DailySection />}
        {activeTab === '종합' && <TotalSection />}
      </ContentContainer>
      <BottomNav />
      {showConnections && (
        <ModalOverlay onClick={() => setShowConnections(false)}>
          <ModalCard onClick={e => e.stopPropagation()}>
            <ModalTitle>연결 정보</ModalTitle>
            <ProfileRow
              onClick={() => {
                setShowConnections(false);
                const params = new URLSearchParams();
                params.set('date', new Date().toISOString().split('T')[0]);
                if (me?.name) {
                  params.set('userName', me.name);
                }
                navigate(`/report?${params.toString()}`);
              }}
            >
              <Avatar $img={me?.imageUrl}>{!me?.imageUrl && '🙂'}</Avatar>
              <NameText>{me?.name ?? '나'}</NameText>
            </ProfileRow>
            {relations
              .filter(
                r => r.status === 'ACCEPTED',
              )
              .map(r => (
                <ProfileRow
                  key={r.relationId}
                  onClick={() => {
                    setShowConnections(false);
                    navigate(
                      `/report?userId=${encodeURIComponent(r.userId)}`,
                    );
                  }}
                >
                  <Avatar>{r.relationType === 'GUARDIAN' ? '🛡️' : '🧑‍⚕️'}</Avatar>
                  <NameText>{r.name}</NameText>
                </ProfileRow>
              ))}
            <CloseBtn onClick={() => setShowConnections(false)}>닫기</CloseBtn>
          </ModalCard>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Report;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const GearBtn = styled.button`
  border: none;
  background: transparent;
  padding: 6px;
  border-radius: 8px;
  cursor: pointer;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
`;

const ModalCard = styled.div`
  width: 80%;
  max-width: 360px;
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  box-sizing: border-box;
`;

const ModalTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 1.1rem;
  color: #333;
`;

const ProfileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
`;

const Avatar = styled.div<{ $img?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $img }) =>
    $img ? `url(${$img}) center/cover no-repeat` : '#f0f8ff'};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e3f2fd;
  font-size: 1.2rem;
`;

const NameText = styled.div`
  font-size: 0.95rem;
  color: #222;
`;

const CloseBtn = styled.button`
  width: 100%;
  margin-top: 12px;
  border: none;
  border-radius: 10px;
  background: #f5f5f5;
  padding: 10px;
  cursor: pointer;
`;
