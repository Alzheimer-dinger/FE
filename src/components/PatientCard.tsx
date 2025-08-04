import styled from 'styled-components';

interface PatientCardProps {
  name: string;
  role: string;
  id: string;
  date: string;
  status: 'connected' | 'requested' | 'disconnected' | 'pending';
  onDisconnect?: () => void;
  onReconnect?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
}

/**
 * PatientCard - 환자/보호자 카드 컴포넌트
 *
 * @param name - 이름
 * @param role - 역할 (환자/보호자)
 * @param id - ID
 * @param date - 날짜
 * @param status - 상태 (connected/requested/disconnected/pending)
 * @param onDisconnect - 해제 핸들러
 * @param onReconnect - 재연결 핸들러
 * @param onAccept - 수락 핸들러
 * @param onReject - 거절 핸들러
 */

const statusMap = {
  connected: { label: '연결됨', color: '#B6F3D1', text: '#1B8E4B' },
  requested: { label: '요청됨', color: '#FFE9B6', text: '#C89A1B' },
  disconnected: { label: '해제됨', color: '#FFD6D6', text: '#E57373' },
};

const PatientCard = ({
  name,
  role,
  id,
  date,
  status,
  onDisconnect,
  onReconnect,
  onAccept,
  onReject,
}: PatientCardProps) => {
  const isPending = status === 'pending';

  return (
    <Card style={{ position: isPending ? 'relative' : 'static' }}>
      {isPending && <NBadge>N</NBadge>}
      <CardLeft>
        <CharImg>🐥</CharImg>
      </CardLeft>
      <CardBody>
        <NameRow>
          <Name>{name}</Name>
          <Role>{role}</Role>
        </NameRow>
        <Info>ID {id}</Info>
        <Info>
          {status === 'disconnected' ? '해제 날짜' : '연결 날짜'} : {date}
        </Info>
        <StatusRow>
          <StatusLeft>
            {!isPending && (
              <StatusBadge $status={status as keyof typeof statusMap}>
                {statusMap[status as keyof typeof statusMap].label}
              </StatusBadge>
            )}
            {isPending && (
              <StatusLeft>
                <AcceptBtn onClick={onAccept}>수락</AcceptBtn>
                <RejectBtn onClick={onReject}>거절</RejectBtn>
              </StatusLeft>
            )}
          </StatusLeft>
          {!isPending && (
            <StatusRight>
              {(status === 'connected' || status === 'requested') && (
                <ActionBtn onClick={onDisconnect}>해제</ActionBtn>
              )}
              {status === 'disconnected' && (
                <ActionBtn onClick={onReconnect}>재연결</ActionBtn>
              )}
            </StatusRight>
          )}
        </StatusRow>
      </CardBody>
    </Card>
  );
};

export default PatientCard;

const Card = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const NBadge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
`;

const CardLeft = styled.div`
  margin-right: 16px;
`;

const CharImg = styled.div`
  font-size: 2.5rem;
`;

const CardBody = styled.div`
  flex: 1;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const Name = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
`;

const Role = styled.span`
  font-size: 0.8rem;
  color: #666;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 12px;
`;

const Info = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 2px;
`;

const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

const StatusLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusRight = styled.div`
  display: flex;
  gap: 8px;
`;

const StatusBadge = styled.span<{ $status: keyof typeof statusMap }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${({ $status }) => statusMap[$status].color};
  color: ${({ $status }) => statusMap[$status].text};
`;

const ActionBtn = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: #f5f5f5;
  color: #333;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #e0e0e0;
  }
`;

const AcceptBtn = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: #4caf50;
  color: white;
  font-size: 0.8rem;
  cursor: pointer;
  margin-right: 8px;
  transition: background 0.2s;

  &:hover {
    background: #45a049;
  }
`;

const RejectBtn = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: #f44336;
  color: white;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #da190b;
  }
`;
