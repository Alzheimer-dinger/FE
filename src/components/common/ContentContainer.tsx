import styled from 'styled-components';

interface ContentContainerProps {
  navMargin?: boolean;
}

const ContentContainer = styled.div.withConfig({
  shouldForwardProp: prop => prop !== 'navMargin',
})<ContentContainerProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  margin-bottom: ${({ navMargin }) => (navMargin ? '70px' : '0')};
  overflow-y: auto;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export default ContentContainer;
