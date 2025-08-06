import styled from 'styled-components';
import { useState } from 'react';
import {
  BackHeader,
  ContentContainer,
  AddPatientModal,
  ConfirmActionModal,
  TabMenu,
} from '@components/index';
import { GoPlus } from 'react-icons/go';

const dummyList = [
  {
    name: '홍길순',
    role: '환자',
    id: '12345678',
    date: '2025/07/10',
    status: 'connected',
  },
  {
    name: '홍길순',
    role: '보호자',
    id: '12345678',
    date: '2025/07/10',
    status: 'requested',
  },
  {
    name: '홍길순',
    role: '환자',
    id: '12345678',
    date: '2025/07/10',
    status: 'disconnected',
  },
  {
    name: '홍길순',
    role: '환자',
    id: '12345678',
    date: '2025/07/10',
    status: 'pending', // 요청 들어온 상태
  },
];

const statusMap = {
  connected: { label: '연결됨', color: '#B6F3D1', text: '#1B8E4B' },
  requested: { label: '요청됨', color: '#FFE9B6', text: '#C89A1B' },
  disconnected: { label: '해제됨', color: '#FFD6D6', text: '#E57373' },
};

type StatusType = keyof typeof statusMap;

const PatientGuardianManage = () => {
  const [tab, setTab] = useState<'전체' | '보호자' | '환자'>('전체');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addId, setAddId] = useState('');
  const [addError, setAddError] = useState('');
  const [confirmModal, setConfirmModal] = useState<null | {
    type: 'disconnect' | 'reconnect';
    idx: number;
  }>(null);

  const filteredList =
    tab === '전체' ? dummyList : dummyList.filter(item => item.role === tab);

  return (
    <Container>
      <BackHeader title="보호자/환자 관리" />
      <ContentContainer>
        <TabMenu
          tabs={['전체', '보호자', '환자']}
          activeTab={tab}
          onTabChange={selectedTab =>
            setTab(selectedTab as '전체' | '보호자' | '환자')
          }
        />
        <OuterBox>
          <CardList>
            {filteredList.map((item, idx) =>
              item.status === 'pending' ? (
                <Card key={idx} style={{ position: 'relative' }}>
                  <NBadge>N</NBadge>
                  <CardLeft>
                    <CharImg>🐥</CharImg>
                  </CardLeft>
                  <CardBody>
                    <NameRow>
                      <Name>{item.name}</Name>
                      <Role>{item.role}</Role>
                    </NameRow>
                    <Info>ID {item.id}</Info>
                    <Info>해제 날짜 : {item.date}</Info>
                    <StatusRow>
                      <StatusLeft>
                        <AcceptBtn>수락</AcceptBtn>
                        <RejectBtn>거절</RejectBtn>
                      </StatusLeft>
                    </StatusRow>
                  </CardBody>
                </Card>
              ) : (
                <Card key={idx}>
                  <CardLeft>
                    <CharImg>🐥</CharImg>
                  </CardLeft>
                  <CardBody>
                    <NameRow>
                      <Name>{item.name}</Name>
                      <Role>{item.role}</Role>
                    </NameRow>
                    <Info>ID {item.id}</Info>
                    <Info>
                      {item.status === 'disconnected'
                        ? '해제 날짜'
                        : '연결 날짜'}{' '}
                      : {item.date}
                    </Info>
                    <StatusRow>
                      <StatusLeft>
                        <StatusBadge $status={item.status as StatusType}>
                          {statusMap[item.status as StatusType].label}
                        </StatusBadge>
                      </StatusLeft>
                      <StatusRight>
                        {item.status === 'connected' && (
                          <ActionBtn
                            onClick={() =>
                              setConfirmModal({ type: 'disconnect', idx })
                            }
                          >
                            해제
                          </ActionBtn>
                        )}
                        {item.status === 'requested' && (
                          <ActionBtn
                            onClick={() =>
                              setConfirmModal({ type: 'disconnect', idx })
                            }
                          >
                            해제
                          </ActionBtn>
                        )}
                        {item.status === 'disconnected' && (
                          <ActionBtn
                            onClick={() =>
                              setConfirmModal({ type: 'reconnect', idx })
                            }
                          >
                            재연결
                          </ActionBtn>
                        )}
                      </StatusRight>
                    </StatusRow>
                  </CardBody>
                </Card>
              ),
            )}
          </CardList>
        </OuterBox>
        <FloatingBtn onClick={() => setShowAddModal(true)}>
          <GoPlus />
        </FloatingBtn>
      </ContentContainer>
      {/* 환자 추가 모달 */}
      {showAddModal && (
        <AddPatientModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          patientId={addId}
          error={addError}
          onPatientIdChange={id => {
            setAddId(id);
            setAddError('');
          }}
          onAdd={() => {
            if (!/^\d{8}$/.test(addId)) {
              setAddError('유효하지 않은 ID입니다.');
              return;
            }
            setShowAddModal(false);
            setAddId('');
            setAddError('');
          }}
        />
      )}
      {/* 해제/재연결 확인 모달 */}
      {confirmModal && (
        <ConfirmActionModal
          isOpen={!!confirmModal}
          actionType={confirmModal.type}
          onConfirm={() => {
            // 해제 또는 재연결 처리
            setConfirmModal(null);
          }}
          onClose={() => setConfirmModal(null)}
        />
      )}
    </Container>
  );
};

export default PatientGuardianManage;

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const OuterBox = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
  margin: 0 1rem;
  width: 100%;
  box-sizing: border-box;
`;

const CardList = styled.div`
  margin-top: 8px;
  width: 100%;
  box-sizing: border-box;
  padding: 0 1rem;
`;

const Card = styled.div`
  display: flex;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  margin-bottom: 18px;
  padding: 18px 18px 12px 18px;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
`;

const CardLeft = styled.div`
  margin-right: 16px;
  display: flex;
  align-items: center;
`;

const CharImg = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
`;

const CardBody = styled.div`
  flex: 1;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Name = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: #222;
`;

const Role = styled.div`
  font-size: 0.95rem;
  color: #888;
  margin-left: 6px;
`;

const Info = styled.div`
  font-size: 0.92rem;
  color: #888;
  margin-top: 2px;
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;

const StatusLeft = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const StatusRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusBadge = styled.div<{ $status: StatusType }>`
  padding: 4px 16px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  background: ${({ $status }) => statusMap[$status].color};
  color: ${({ $status }) => statusMap[$status].text};
`;

const ActionBtn = styled.button`
  border: none;
  border-radius: 12px;
  padding: 4px 18px;
  font-size: 0.95rem;
  font-weight: 600;
  margin-left: 8px;
  cursor: pointer;
  background: #f5f5f5;
  color: #222;
`;

const FloatingBtn = styled.button`
  position: fixed;
  right: max(calc((100vw - 425px) / 2 + 32px), 32px);
  bottom: 32px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #6c3cff;
  color: #fff;
  font-size: 2.2rem;
  border: none;
  box-shadow: 0 4px 16px rgba(108, 60, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
`;

const NBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 22px;
  height: 22px;
  background: #e53935;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;
  z-index: 2;
`;

const AcceptBtn = styled.button`
  background: #e6fff3;
  color: #1b8e4b;
  border: none;
  border-radius: 12px;
  padding: 4px 18px;
  font-size: 0.95rem;
  font-weight: 600;
  margin-right: 8px;
  cursor: pointer;
`;

const RejectBtn = styled.button`
  background: #ffeaea;
  color: #e53935;
  border: none;
  border-radius: 12px;
  padding: 4px 18px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
`;
