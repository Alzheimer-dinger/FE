import styled from 'styled-components';
import Picker from 'react-mobile-picker';
import { Button } from '@components/index';

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
          <Button buttonText="선택" type="default" onClick={onConfirm} />
          <Button buttonText="해제" type="sub" onClick={onCancel} />
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
  padding: 24px;
  width: 100%;
  max-width: 320px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
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

const PickerColumnWrapper = styled.div`
  margin: 0 16px;
`;
