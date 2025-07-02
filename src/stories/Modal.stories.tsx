import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import styled from '@emotion/styled';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import CombatModalContent from '../components/feature/CombatModalContent';
import EventModalContent from '../components/feature/EventModalContent';

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
      <CombatModalContent />
    </ModalTemplate>
  ),
};

export const EventModal: Story = {
  render: () => (
    <ModalTemplate>
      <EventModalContent onConfirm={() => alert('확인됨')} />
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
