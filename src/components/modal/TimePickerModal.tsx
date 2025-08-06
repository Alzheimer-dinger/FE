import styled from 'styled-components';
import Picker from 'react-mobile-picker';

interface TimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeValue: {
    hour: string;
    minute: string;
    period: string;
  };
  // eslint-disable-next-line no-unused-vars
  onTimeChange: (value: any) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const TimePickerModal = ({
  isOpen,
  timeValue,
  onTimeChange,
  onConfirm,
  onCancel,
}: TimePickerModalProps) => {
  if (!isOpen) return null;

  // Picker 데이터
  const hourOptions = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const minuteOptions = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, '0'),
  );
  const periodOptions = ['오전', '오후'];

  return (
    <TimeModalOverlay>
      <TimeModalContent onClick={e => e.stopPropagation()}>
        <Picker
          value={timeValue}
          onChange={onTimeChange}
          height={180}
          itemHeight={36}
        >
          <PickerColumnWrapper>
            <Picker.Column name="hour">
              {hourOptions.map(h => (
                <Picker.Item value={h} key={h}>
                  {h}
                </Picker.Item>
              ))}
            </Picker.Column>
          </PickerColumnWrapper>
          <PickerColumnWrapper>
            <Picker.Column name="minute">
              {minuteOptions.map(m => (
                <Picker.Item value={m} key={m}>
                  {m}
                </Picker.Item>
              ))}
            </Picker.Column>
          </PickerColumnWrapper>
          <PickerColumnWrapper>
            <Picker.Column name="period">
              {periodOptions.map(p => (
                <Picker.Item value={p} key={p}>
                  {p}
                </Picker.Item>
              ))}
            </Picker.Column>
          </PickerColumnWrapper>
        </Picker>
        <SelectedTimeText>
          선택된 시간 : {timeValue.period} {timeValue.hour}:{timeValue.minute}
        </SelectedTimeText>
        <TimeModalButtonRow>
          <TimeModalButton onClick={onConfirm}>선택</TimeModalButton>
          <TimeModalButtonGray onClick={onCancel}>해제</TimeModalButtonGray>
        </TimeModalButtonRow>
      </TimeModalContent>
    </TimeModalOverlay>
  );
};

export default TimePickerModal;

// Styled Components
const TimeModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TimeModalContent = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 32px 24px 24px 24px;
  min-width: 260px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SelectedTimeText = styled.div`
  color: #b266ff;
  font-size: 1rem;
  margin-bottom: 16px;
`;

const TimeModalButtonRow = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

const TimeModalButton = styled.button`
  flex: 1;
  background: #6c3cff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const TimeModalButtonGray = styled.button`
  flex: 1;
  background: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const PickerColumnWrapper = styled.div`
  margin: 0 16px;
`;
