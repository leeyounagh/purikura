import React from 'react';
import styled from 'styled-components/native';

const Background = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
  resize-mode: cover;
`;

export const BackgroundImage = () => {
  return <Background source={require('../../../../assets/images/sample/bg.jpg')} />;
};
