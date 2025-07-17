import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { IoArrowBackOutline, IoSearch } from 'react-icons/io5';

interface HeaderProps {
  text: string;
  onSearch: () => void;
  // eslint-disable-next-line no-unused-vars
  onTextChange: (value: string) => void;
}

const SearchHeader = ({ text, onSearch, onTextChange }: HeaderProps) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState(text);

  const handleSearch = () => {
    if (inputValue.trim()) {
      console.log(inputValue);
      onSearch();
    }
  };
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <HeaderContainer>
      <IoArrowBackOutline
        color="#38006B"
        size={24}
        onClick={handleBack}
        style={{ cursor: 'pointer' }}
      />
      <Input
        type="text"
        value={inputValue}
        onChange={e => {
          setInputValue(e.target.value);
          onTextChange(e.target.value);
        }}
        placeholder="검색어를 입력하세요"
      />
      <IoSearch
        color="#38006B"
        size={24}
        onClick={handleSearch}
        style={{ cursor: 'pointer' }}
      />
    </HeaderContainer>
  );
};

export default SearchHeader;

const HeaderContainer = styled.header`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: '#38006B';
  border-bottom: 1.5px solid #38006b;
  box-sizing: border-box;
`;

const Input = styled.input`
  font-size: 1rem;
  color: #000;
  border: 1.5px solid #38006b;
  border-radius: 0.5rem;
  flex-grow: 1;
  margin: 0 0.5rem;
  padding: 0.7rem;

  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #d9d9d9;
  }
`;
