import styled from 'styled-components';

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 1rem;
  padding: 1.6rem 1.4rem;
  margin-bottom: 70px;
  overflow-y: auto;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export default ContentContainer;
