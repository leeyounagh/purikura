// components/common/BottomModal.tsx
import React from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';

const ModalContainer = styled.View`
  background-color: white;
  padding: 20px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  max-height: 70%;
`;

type Props = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function BottomModal({ isVisible, onClose, children }: Props) {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={{ justifyContent: 'flex-end', margin: 0 }}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <ModalContainer>
        {children}
      </ModalContainer>
    </Modal>
  );
}
