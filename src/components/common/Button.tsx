import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  onClick?: () => void;
  buttonText: string;
  type?: 'default' | 'sub';
  className?: string;
  isDisabled?: boolean;
  style?: React.CSSProperties;
  bgColor?: string;
  txtColor?: string;
}

/**
 * Common Button
 * isDisabled: button 비활성화 여부
 * type: 버튼 별 style (default, sub)
 * buttonText: 버튼 텍스트
 * bgColor: 버튼 배경색 (선택적)
 * @param  onClick () => void (onClick method)
 * @param isDisabled boolean (disabled status)
 */

const Button = ({
  onClick,
  buttonText,
  type,
  className,
  isDisabled,
  style,
  bgColor,
  txtColor,
}: ButtonProps) => {
  return (
    <ButtonContainer
      className={`button ${type} ${className}`}
      onClick={onClick}
      disabled={isDisabled}
      style={style}
      bgColor={bgColor}
      txtColor={txtColor}
    >
      {buttonText}
    </ButtonContainer>
  );
};

export default Button;

const ButtonContainer = styled.button<{ bgColor?: string; txtColor?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;

  &.default {
    width: 100%;
    background-color: #6a1b9a;
    color: #fff;
    font-size: 0.8rem;
    font-weight: 500;
    border-radius: 0.5rem;
    padding: 0.8rem 0;
  }

  &.sub {
    width: 100%;
    background-color: #d9d9d9;
    color: #fff;
    font-size: 0.8rem;
    font-weight: 500;
    border-radius: 0.5rem;
    padding: 0.8rem 0;
  }
`;
