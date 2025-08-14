import { Button } from '@components/index';
import styled from 'styled-components';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRating: string;
  feedbackReason: string;
  // eslint-disable-next-line no-unused-vars
  onRatingChange: (rating: string) => void;
  // eslint-disable-next-line no-unused-vars
  onReasonChange: (reason: string) => void;
  onSubmit: () => void;
}

const FeedbackModal = ({
  isOpen,
  onClose,
  selectedRating,
  feedbackReason,
  onRatingChange,
  onReasonChange,
  onSubmit,
}: FeedbackModalProps) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalTitle>사용 후기를 남겨주세요!</ModalTitle>
        <RatingContainer>
          {[
            { rating: 'VERY_LOW', emoji: '😡' },
            { rating: 'LOW', emoji: '😞' },
            { rating: 'MEDIUM', emoji: '😐' },
            { rating: 'HIGH', emoji: '🙂' },
            { rating: 'VERY_HIGH', emoji: '😄' },
          ].map(item => (
            <RatingEmoji
              key={item.rating}
              $selected={selectedRating === item.rating}
              onClick={() => onRatingChange(item.rating)}
            >
              {item.emoji}
            </RatingEmoji>
          ))}
        </RatingContainer>
        <FeedbackLabel>이유를 적어주세요</FeedbackLabel>
        <FeedbackTextarea
          placeholder="피드백을 입력해주세요..."
          value={feedbackReason}
          onChange={e => onReasonChange(e.target.value)}
        />
        <Button buttonText="제출" type="default" onClick={onSubmit} />
      </ModalContent>
    </ModalOverlay>
  );
};

export default FeedbackModal;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
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

const ModalTitle = styled.h2`
  font-size: 1.2rem;
  color: #222;
  margin-bottom: 12px;
  text-align: center;
`;

const RatingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
  width: 100%;
  box-sizing: border-box;
`;

const RatingEmoji = styled.div<{ $selected: boolean }>`
  font-size: 2rem;
  cursor: pointer;
  padding: 6px 0;
  border-radius: 1rem;
  background: ${({ $selected }) => ($selected ? '#f3e8fd' : 'transparent')};
  border: 2px solid
    ${({ $selected }) => ($selected ? '#6c3cff' : 'transparent')};
  transition: all 0.2s;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.05);
  }
`;

const FeedbackLabel = styled.div`
  color: #888;
  font-size: 1rem;
  margin-bottom: 8px;
  align-self: flex-start;
`;

const FeedbackTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  max-height: 180px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  font-size: 0.95rem;
  resize: vertical;
  margin-bottom: 2rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #6c3cff;
  }
`;
