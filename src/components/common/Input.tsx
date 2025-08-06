import React from 'react';
import styled from 'styled-components';

interface InputProps {
  type: 'default';
  name?: string;
  value: string;
  placeholder: string;
  className?: string;
  inputType: React.HTMLInputTypeAttribute;
  // eslint-disable-next-line no-unused-vars
  onEnterPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  // eslint-disable-next-line no-unused-vars
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
  readOnly?: boolean;
}

/**
 * Common Input
 * type: input 스타일 타입 (현재는 'default'만 사용)
 * name: input name 속성
 * value: input value 값
 * placeholder: placeholder 텍스트
 * inputType: HTML input 타입 (e.g. text, password 등)
 * className: 추가적인 className (선택)
 * onChange: input 변경 시 실행되는 함수
 * onEnterPress: Enter 키 눌렀을 때 실행되는 함수 (선택)
 * style: 인라인 스타일 객체 (선택)
 * readOnly: 읽기 전용 여부 (선택)
 */

const Input = ({
  type,
  name,
  value,
  placeholder,
  className = '',
  inputType,
  onEnterPress,
  onChange,
  style,
  readOnly,
}: InputProps) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onEnterPress) {
      onEnterPress(event);
    }
  };

  return (
    <InputBox
      type={inputType}
      name={name}
      value={value}
      placeholder={placeholder}
      className={`input ${type} ${className}`}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      style={style}
      readOnly={readOnly}
    />
  );
};

export default Input;

export const InputBox = styled.input`
  border: none;
  outline: none;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
  }

  &.default {
    font-size: 0.8rem;
    background-color: transparent;
    border: 1px solid #d9d9d9;
    color: #000;
    border-radius: 0.5rem;
    padding: 0.9rem;

    &::placeholder {
      color: #a1a1a1;
    }
  }
`;
