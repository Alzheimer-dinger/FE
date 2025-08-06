import styled from 'styled-components';
import React from 'react';

interface SettingItemProps {
  icon: string;
  iconBgColor: string;
  text: string;
  onClick?: () => void;
  rightElement?: React.ReactNode;
  showArrow?: boolean;
}

const SettingItem = ({
  icon,
  iconBgColor,
  text,
  onClick,
  rightElement,
  showArrow = false,
}: SettingItemProps) => {
  return (
    <ItemContainer onClick={onClick}>
      <SettingIcon style={{ background: iconBgColor }}>{icon}</SettingIcon>
      <SettingText>{text}</SettingText>
      {rightElement && rightElement}
      {showArrow && <ArrowIcon>›</ArrowIcon>}
    </ItemContainer>
  );
};

export default SettingItem;

// Styled Components
const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const SettingIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-right: 16px;
`;

const SettingText = styled.span`
  flex: 1;
  font-size: 1rem;
  color: #333;
  font-weight: 500;
`;

const ArrowIcon = styled.span`
  color: #ccc;
  font-size: 1.2rem;
  font-weight: bold;
`;
