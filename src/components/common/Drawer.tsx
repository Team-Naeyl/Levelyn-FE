import type { ReactNode } from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Icon } from '@iconify/react';
import addIcon from '@iconify-icons/material-symbols/add';
import Button from './Button';

const HEADER_HEIGHT = 60;
const DRAWER_HEADER_HEIGHT = 60;
const ADD_BUTTON_HEIGHT = 80;
const ITEM_HEIGHT = 66;
const PADDING = 40;
const MIN_DRAWER_HEIGHT = 200;

interface DrawerProps {
  children: ReactNode;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  onAdd?: () => void;
  itemCount?: number;
}

export const Drawer = ({ children, isOpen = false, onToggle, onAdd, itemCount = 0 }: DrawerProps) => {
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState(0);
  const drawerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const bottomNavHeight = 20;

  const updateWindowHeight = useCallback(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateWindowHeight);
    return () => window.removeEventListener('resize', updateWindowHeight);
  }, [updateWindowHeight]);

  const { defaultPosition, expandedPosition } = useCallback(() => {
    // 할일 아이템 2개가 보이는 기본 크기
    const defaultPos = windowHeight - (208 + bottomNavHeight);

    // 할일 목록 전체를 보여주는 동적 높이 계산
    const requiredHeight = DRAWER_HEADER_HEIGHT + itemCount * ITEM_HEIGHT + ADD_BUTTON_HEIGHT + PADDING;
    const maxAvailableHeight = windowHeight - HEADER_HEIGHT;
    const finalHeight = Math.max(MIN_DRAWER_HEIGHT, Math.min(requiredHeight, maxAvailableHeight));
    const expandedPos = windowHeight - finalHeight;

    return { defaultPosition: defaultPos, expandedPosition: expandedPos };
  }, [windowHeight, itemCount])();

  useEffect(() => {
    setCurrentY(isOpen ? expandedPosition : defaultPosition);
  }, [isOpen, defaultPosition, expandedPosition]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as Element;
    const isScrollArea = contentRef.current?.contains(target);

    if (isScrollArea && contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

      if (!isAtTop && !isAtBottom) {
        return;
      }
    }

    setDragStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStart === null) return;

    const currentTouch = e.touches[0].clientY;
    const deltaY = currentTouch - dragStart;

    const newY = Math.max(expandedPosition, Math.min(defaultPosition, currentY + deltaY));

    setCurrentY(newY);
  };

  const handleTouchEnd = () => {
    if (dragStart === null) return;

    const defaultThreshold = (defaultPosition - expandedPosition) / 3;

    if (currentY < defaultPosition - defaultThreshold) {
      setCurrentY(expandedPosition);
      onToggle?.(true);
    } else if (currentY > defaultPosition + defaultThreshold) {
      setCurrentY(defaultPosition);
      onToggle?.(false);
    } else {
      setCurrentY(defaultPosition);
      onToggle?.(false);
    }

    setDragStart(null);
  };

  const handleHandleClick = () => {
    if (currentY === expandedPosition) {
      setCurrentY(defaultPosition);
      onToggle?.(false);
    } else {
      setCurrentY(expandedPosition);
      onToggle?.(true);
    }
  };

  return (
    <>
      <DrawerContainer
        ref={drawerRef}
        isOpen={isOpen}
        style={{ transform: `translateX(-50%) translateY(${currentY}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <DrawerHandle onClick={handleHandleClick} />
        <DrawerContent ref={contentRef}>{children}</DrawerContent>
      </DrawerContainer>
      {isOpen && onAdd && (
        <AddButtonContainer>
          <Button
            label="할일 추가"
            onClick={onAdd}
            fullWidth
            color="primary"
            icon={<Icon icon={addIcon} />}
          />
        </AddButtonContainer>
      )}
    </>
  );
};

const DrawerContainer = styled.div<{ isOpen: boolean }>`
  ${({ theme, isOpen }) => css`
    position: fixed;
    left: 50%;
    width: 100%;
    max-width: 480px;
    height: 100vh;
    background: ${theme.colors.white};

    box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.06);
    z-index: ${isOpen ? 10 : 4}; /* 확장 시 BottomNav(z-index: 5)보다 위에 */
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
  `}
`;

const DrawerHandle = styled.div`
  ${({ theme }) => css`
    width: 40px;
    height: 4px;
    background: ${theme.colors.gray[100]};
    border-radius: 2px;
    margin: 12px auto 16px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background: ${theme.colors.gray[200]};
    }
  `}
`;

const DrawerContent = styled.div`
  padding: 0 20px 100px; /* AddButton 공간 확보 */
  height: calc(100vh - 140px); /* AddButton 높이 고려 */
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
`;

const AddButtonContainer = styled.div`
  ${({ theme }) => css`
    position: fixed;
    padding: 0 20px;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    height: 80px;
    background: ${theme.colors.white};
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  `}
`;
