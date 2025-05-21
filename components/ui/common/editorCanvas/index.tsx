import { useImageStore } from '@/store/useImageStore';
import React, { useEffect, useState } from 'react';
import { Image as RNImage } from 'react-native';
import styled from 'styled-components/native';

const CanvasWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const DynamicPhoto = styled.Image<{ $aspectRatio: number }>`
  width: 80%;
  aspect-ratio: ${(props) => props.$aspectRatio};
  resize-mode: cover;
  background-color: #191919;
`;

export default function EditorCanvas() {
  const imageUri = useImageStore((state) => state.imageUri);
  const [aspectRatio, setAspectRatio] = useState(3 / 4); 

  useEffect(() => {
    if (imageUri) {
      RNImage.getSize(
        imageUri,
        (width, height) => {
          setAspectRatio(width / height);
        },
        (error) => {
          console.warn('이미지 크기 가져오기 실패:', error);
        }
      );
    }
  }, [imageUri]);

  return (
    <CanvasWrapper>
      <DynamicPhoto
        source={imageUri ? { uri: imageUri } : undefined}
        $aspectRatio={aspectRatio}
      />
    </CanvasWrapper>
  );
}
