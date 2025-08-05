import styled from 'styled-components';
import BackHeader from '@components/common/Header/BackHeader';
import { useState } from 'react';
import { IoPersonOutline } from 'react-icons/io5';

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
    <Wrapper>
      <BackHeader title="보호자/환자 관리" />
      <Content>
        <OuterBox>
          <TabBar>
            {['전체', '보호자', '환자'].map(t => (
              <TabBtn
                key={t}
                $active={tab === t}
                onClick={() => setTab(t as any)}
              >
                {t}
              </TabBtn>
            ))}
          </TabBar>
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
        <FloatingBtn onClick={() => setShowAddModal(true)}>＋</FloatingBtn>
      </Content>
      {/* 환자 추가 모달 */}
      {showAddModal && (
        <ModalOverlay onClick={() => setShowAddModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>환자 추가</ModalTitle>
            <InputBox $error={!!addError}>
              <IoPersonOutline
                size={28}
                color={addError ? '#e53935' : '#bbb'}
                style={{ marginRight: 8 }}
              />
              <AddInput
                placeholder="환자 ID를 입력하세요"
                value={addId}
                onChange={e => {
                  setAddId(e.target.value);
                  setAddError('');
                }}
              />
            </InputBox>
            {addError && <ErrorMsg>{addError}</ErrorMsg>}
            <AddBtn
              onClick={() => {
                // 예시: 8자리 숫자만 유효
                if (!/^\d{8}$/.test(addId)) {
                  setAddError('유효하지 않은 ID입니다.');
                  return;
                }
                setShowAddModal(false);
                setAddId('');
                setAddError('');
              }}
            >
              추가하기
            </AddBtn>
          </ModalContent>
        </ModalOverlay>
      )}
      {/* 해제/재연결 확인 모달 */}
      {confirmModal && (
        <ModalOverlay onClick={() => setConfirmModal(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle style={{ marginBottom: 32 }}>
              {confirmModal.type === 'disconnect'
                ? '연결을 해제하시겠습니까?'
                : '재연결 하시겠습니까?'}
            </ModalTitle>
            <ConfirmBtnRow>
              <ConfirmBtn
                onClick={() => {
                  // 실제 해제/재연결 로직은 여기에 (더미)
                  setConfirmModal(null);
                }}
              >
                네
              </ConfirmBtn>
              <ConfirmBtnGray onClick={() => setConfirmModal(null)}>
                아니요
              </ConfirmBtnGray>
            </ConfirmBtnRow>
          </ModalContent>
        </ModalOverlay>
      )}
    </Wrapper>
  );
};

export default PatientGuardianManage;

const Wrapper = styled.div`
  min-height: 100vh;
  background: #fff;
  width: 100vw;
  max-width: 425px;
  min-width: 320px;
  margin: 0 auto;
`;

const Content = styled.div`
  width: 100%;
  max-width: 425px;
  min-width: 320px;
  margin: 0 auto;
  padding: 0 0 40px 0;
`;

const OuterBox = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
  padding: 18px 0 18px 0;
  margin: 0 auto 24px auto;
  width: 100%;
  max-width: 400px;
`;

const TabBar = styled.div`
  display: flex;
  background: #f5f5f5;
  border-radius: 999px;
  margin: 24px auto 16px auto;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  padding: 4px 6px;
  width: 90%;
  max-width: 340px;
  min-width: 220px;
  align-items: center;
`;

const TabBtn = styled.button<{ $active?: boolean }>`
  flex: 1;
  border: none;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? '#6c3cff' : 'transparent')};
  color: ${({ $active }) => ($active ? '#fff' : '#222')};
  font-weight: 600;
  font-size: 1.1rem;
  width: 70px;
  height: 38px;
  min-width: 60px;
  min-height: 32px;
  padding: 0;
  margin: 0 2px;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
`;

const CardList = styled.div`
  margin-top: 8px;
  width: 95%;
  max-width: 380px;
  min-width: 280px;
  margin-left: auto;
  margin-right: auto;
`;

const Card = styled.div`
  display: flex;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  margin-bottom: 18px;
  padding: 18px 18px 12px 18px;
  align-items: flex-start;
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.18);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 32px 24px 24px 24px;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.3rem;
  color: #222;
  margin-bottom: 24px;
`;

const InputBox = styled.div<{ $error?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  background: #fafafa;
  border-radius: 12px;
  border: 2px solid ${({ $error }) => ($error ? '#e53935' : '#eee')};
  padding: 10px 16px;
  margin-bottom: 8px;
`;

const AddInput = styled.input`
  border: none;
  background: transparent;
  font-size: 1.1rem;
  flex: 1;
  outline: none;
  color: #222;
  &::placeholder {
    color: #bbb;
  }
`;

const ErrorMsg = styled.div`
  color: #e53935;
  font-size: 0.98rem;
  margin-bottom: 12px;
  width: 100%;
`;

const AddBtn = styled.button`
  width: auto;
  min-width: 120px;
  background: #6c3cff;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px 24px;
  font-size: 1rem;
  font-weight: 600;
  margin: 8px auto 0 auto;
  display: block;
  cursor: pointer;
`;

const ConfirmBtnRow = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  margin-top: 8px;
`;

const ConfirmBtn = styled.button`
  flex: 1;
  background: #6c3cff;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 12px 0;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
`;

const ConfirmBtnGray = styled.button`
  flex: 1;
  background: #f5f5f5;
  color: #aaa;
  border: none;
  border-radius: 10px;
  padding: 12px 0;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
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
