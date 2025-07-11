import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import styled from '@emotion/styled';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import CombatModalContent from '../components/common/Modal/CombatModalContent';
import EventModalContent from '../components/common/Modal/EventModalContent';
import type { InitialBattleData } from '../types/battle.types';

const ModalContent = styled.div`
  text-align: center;

  h3 {
    margin-top: 0;
    margin-bottom: 8px;
  }

  p {
    margin: 0;
  }
`;

const mockInitialBattleData: InitialBattleData = {
  id: 'battle-1',
  mob: {
    id: 1,
    type: {
      id: 1,
      value: 'normal',
    },
    name: '슬라임',
    hp: 100,
    regionId: 1,
    typeId: 1,
  },
  player: {
    level: 1,
    exp: 0,
    attack: 10,
    will: 5,
    skills: [
      {
        id: 1,
        name: '강타',
        description: '강력한 공격',
        type: {
          id: 1,
          value: 'active',
        },
      },
    ],
  },
};

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
};

export default meta;

type Story = StoryObj<typeof Modal>;

const ModalTemplate = ({
  children,
  startOpen = true,
  noPadding = false,
}: {
  children: ReactNode;
  startOpen?: boolean;
  noPadding?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(startOpen);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        noPadding={noPadding}
      >
        {children}
      </Modal>
    </>
  );
};

export const CombatModal: Story = {
  render: () => (
    <ModalTemplate noPadding>
      <CombatModalContent initialData={mockInitialBattleData} />
    </ModalTemplate>
  ),
};

export const EventModal: Story = {
  render: () => (
    <ModalTemplate>
      <EventModalContent
        title="이벤트 발생!"
        description={'몬스터를 만났습니다.\n전투를 준비하세요!'}
        onConfirm={() => alert('확인됨')}
      />
    </ModalTemplate>
  ),
};

export const AcquisitionModal: Story = {
  render: () => (
    <ModalTemplate>
      <ModalContent>
        <h3>아이템 획득!</h3>
        <p>포션을 획득했습니다.</p>
      </ModalContent>
    </ModalTemplate>
  ),
};
