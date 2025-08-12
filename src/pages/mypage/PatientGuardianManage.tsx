import styled from 'styled-components';
import { useState, useEffect } from 'react';
import {
  BackHeader,
  ContentContainer,
  AddPatientModal,
  ConfirmActionModal,
  TabMenu,
} from '@components/index';
import { GoPlus } from 'react-icons/go';
import { 
  getRelations, 
  sendRelationRequest, 
  replyToRelationRequest, 
  deleteRelation,
  type Relation 
} from '@services/index';

// 관계 상태를 UI 상태로 변환하는 함수
const mapRelationStatus = (relation: Relation) => {
  switch (relation.status) {
    case 'ACCEPTED':
      return { label: '연결됨', color: '#B6F3D1', text: '#1B8E4B', status: 'connected' };
    case 'REQUESTED':
      return { label: '요청됨', color: '#FFE9B6', text: '#C89A1B', status: 'requested' };
    case 'REJECTED':
      return { label: '거절됨', color: '#FFD6D6', text: '#E57373', status: 'disconnected' };
    case 'EXPIRED':
      return { label: '만료됨', color: '#FFD6D6', text: '#E57373', status: 'disconnected' };
    default:
      return { label: '알 수 없음', color: '#E0E0E0', text: '#757575', status: 'disconnected' };
  }
};

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
  const [relations, setRelations] = useState<Relation[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState<null | {
    type: 'disconnect' | 'reconnect';
    relation: Relation;
  }>(null);

  // 관계 목록 조회
  useEffect(() => {
    const fetchRelations = async () => {
      try {
        setLoading(true);
        const relationsData = await getRelations();
        setRelations(relationsData);
      } catch (error) {
        console.error('관계 목록 조회 실패:', error);
        // 로컬 스토리지에서 데이터 가져오기 (마이페이지에서 미리 조회한 데이터)
        const localRelations = localStorage.getItem('relations');
        if (localRelations) {
          setRelations(JSON.parse(localRelations));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRelations();
  }, []);

  // 탭별 필터링
  const filteredRelations = relations.filter(relation => {
    if (tab === '전체') return true;
    if (tab === '보호자') return relation.relationType === 'GUARDIAN';
    if (tab === '환자') return relation.relationType === 'PATIENT';
    return true;
  });

  // 관계 요청 응답 (수락/거절)
  const handleRelationReply = async (relation: Relation, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await replyToRelationRequest(relation.counterId, status);
      // 관계 목록 새로고침
      const updatedRelations = await getRelations();
      setRelations(updatedRelations);
    } catch (error) {
      console.error('관계 요청 응답 실패:', error);
      alert('요청 처리에 실패했습니다.');
    }
  };

  // 관계 해제
  const handleRelationDelete = async (relation: Relation) => {
    try {
      await deleteRelation(relation.counterId);
      // 관계 목록 새로고침
      const updatedRelations = await getRelations();
      setRelations(updatedRelations);
      setConfirmModal(null);
    } catch (error) {
      console.error('관계 해제 실패:', error);
      alert('관계 해제에 실패했습니다.');
    }
  };

  // 환자 추가 (관계 요청 전송)
  const handleAddPatient = async (patientId: string) => {
    try {
      await sendRelationRequest(patientId);
      setShowAddModal(false);
      setAddId('');
      setAddError('');
      alert('관계 요청이 전송되었습니다.');
      // 관계 목록 새로고침
      const updatedRelations = await getRelations();
      setRelations(updatedRelations);
    } catch (error) {
      console.error('관계 요청 전송 실패:', error);
      setAddError('관계 요청 전송에 실패했습니다.');
    }
  };

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
          {loading ? (
            <LoadingText>로딩 중...</LoadingText>
          ) : filteredRelations.length === 0 ? (
            <EmptyText>등록된 관계가 없습니다.</EmptyText>
          ) : (
            <CardList>
              {filteredRelations.map((relation) => {
                const statusInfo = mapRelationStatus(relation);
                const isPending = relation.status === 'REQUESTED' && relation.initiator !== 'GUARDIAN';
                
                                 return isPending ? (
                   <Card key={relation.counterId} style={{ position: 'relative' }}>
                     <NBadge>N</NBadge>
                     <CardLeft>
                       <CharImg>🐥</CharImg>
                     </CardLeft>
                     <CardBody>
                       <NameRow>
                         <Name>{relation.name}</Name>
                         <Role>{relation.relationType === 'GUARDIAN' ? '보호자' : '환자'}</Role>
                       </NameRow>
                       <Info>ID {relation.patientCode}</Info>
                       <Info>요청 날짜: {new Date(relation.createdAt).toLocaleDateString()}</Info>
                       <StatusRow>
                         <StatusLeft>
                           <AcceptBtn onClick={() => handleRelationReply(relation, 'ACCEPTED')}>
                             수락
                           </AcceptBtn>
                           <RejectBtn onClick={() => handleRelationReply(relation, 'REJECTED')}>
                             거절
                           </RejectBtn>
                         </StatusLeft>
                       </StatusRow>
                     </CardBody>
                   </Card>
                 ) : (
                   <Card key={relation.counterId}>
                    <CardLeft>
                      <CharImg>🐥</CharImg>
                    </CardLeft>
                    <CardBody>
                      <NameRow>
                        <Name>{relation.name}</Name>
                        <Role>{relation.relationType === 'GUARDIAN' ? '보호자' : '환자'}</Role>
                      </NameRow>
                      <Info>ID {relation.patientCode}</Info>
                      <Info>
                        {relation.status === 'ACCEPTED' ? '연결 날짜' : '요청 날짜'}: {new Date(relation.createdAt).toLocaleDateString()}
                      </Info>
                      <StatusRow>
                        <StatusLeft>
                          <StatusBadge $status={statusInfo.status as StatusType}>
                            {statusInfo.label}
                          </StatusBadge>
                        </StatusLeft>
                        <StatusRight>
                          {relation.status === 'ACCEPTED' && (
                            <ActionBtn
                              onClick={() =>
                                setConfirmModal({ type: 'disconnect', relation })
                              }
                            >
                              해제
                            </ActionBtn>
                          )}
                          {relation.status === 'REQUESTED' && relation.initiator === 'GUARDIAN' && (
                            <ActionBtn
                              onClick={() =>
                                setConfirmModal({ type: 'disconnect', relation })
                              }
                            >
                              해제
                            </ActionBtn>
                          )}
                          {(relation.status === 'REJECTED' || relation.status === 'EXPIRED') && (
                            <ActionBtn
                              onClick={() =>
                                setConfirmModal({ type: 'reconnect', relation })
                              }
                            >
                              재연결
                            </ActionBtn>
                          )}
                        </StatusRight>
                      </StatusRow>
                    </CardBody>
                  </Card>
                );
              })}
            </CardList>
          )}
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
            handleAddPatient(addId);
          }}
        />
      )}
      {/* 해제/재연결 확인 모달 */}
      {confirmModal && (
        <ConfirmActionModal
          isOpen={!!confirmModal}
          actionType={confirmModal.type}
          onConfirm={() => {
            if (confirmModal.type === 'disconnect') {
              handleRelationDelete(confirmModal.relation);
            } else if (confirmModal.type === 'reconnect') {
              // 재연결 로직 (새로운 관계 요청)
              handleAddPatient(confirmModal.relation.patientCode);
              setConfirmModal(null);
            }
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

const LoadingText = styled.div`
  text-align: center;
  padding: 2rem;
  color: #888;
  font-size: 1rem;
`;

const EmptyText = styled.div`
  text-align: center;
  padding: 2rem;
  color: #888;
  font-size: 1rem;
`;
