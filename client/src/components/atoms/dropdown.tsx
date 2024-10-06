import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

type DropdownProps = {
  options: string[];
  selectedOption: string | boolean;
  onOptionSelect: (option: string, id?: string) => void;
  placeholder?: string;
  idRequired?: boolean;
  style?: any;
};

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedOption,
  onOptionSelect,
  style,
  placeholder,
  idRequired = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (option: string, id?: string) => {
    onOptionSelect(option, id);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownHeader onClick={() => setIsOpen(!isOpen)} tabIndex={0} style={style}>
        {selectedOption || <DropdownPlaceholder> {placeholder}</DropdownPlaceholder>}
        <StyledArrowDownIcon />
      </DropdownHeader>
      {isOpen && (
        <DropdownList $styleWidth={style?.width}>
          {idRequired
            ? options.map(({ name, id }: any) => (
                <DropdownListItem key={id} onClick={() => handleOptionClick(name, id)}>
                  {name}
                </DropdownListItem>
              ))
            : options.map((option, index) => (
                <DropdownListItem key={index} onClick={() => handleOptionClick(option)}>
                  {option}
                </DropdownListItem>
              ))}
        </DropdownList>
      )}
    </DropdownContainer>
  );
};

export default Dropdown;

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin-left: 5px;
  border: none;
  color: ${({ theme }) => theme.colors.basic.white};
  font-size: ${({ theme }) => theme.fonts.smallestFont};
  border-radius: 4px;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.accent.accent1};
    outline-offset: 2px;
  }
`;

const DropdownList = styled.ul<{ $styleWidth?: string }>`
  position: absolute;
  width: ${({ $styleWidth }) => ($styleWidth ? `calc(${$styleWidth} * 0.85)` : "85%")};
  margin: 0;
  padding: 0;
  left: 10px;
  list-style: none;
  z-index: 10;
  color: ${({ theme }) => theme.colors.basic.white};
  background-color: ${({ theme }) => theme.colors.primary.dark};
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.primary.light};
`;

const DropdownListItem = styled.li`
  padding: 6px;
  color: ${({ theme }) => theme.colors.basic.white};
  cursor: pointer;

  &:first-child {
    border-radius: 10px 10px 0 0;
  }
  &:last-child {
    border-radius: 0 0 10px 10px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent.accent1};
  }
`;

const DropdownPlaceholder = styled.div`
  color: ${({ theme }) => theme.colors.neutral.placeholder};
`;

const StyledArrowDownIcon = styled(MdOutlineKeyboardArrowDown)`
  font-size: 2rem;
  display: inline-block;
`;
