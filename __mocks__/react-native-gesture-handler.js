// __mocks__/react-native-gesture-handler.js

const { View, Pressable } = require('react-native');

const mockGesture = {
  onStart: jest.fn(() => mockGesture),
  onUpdate: jest.fn(() => mockGesture),
  onEnd: jest.fn(() => mockGesture),
  minDistance: jest.fn(() => mockGesture),
};

module.exports = {
  GestureHandlerRootView: View,
  GestureDetector: ({ children }) => children,
  Pressable,
  Gesture: {
    Pan: jest.fn(() => mockGesture),
    Pinch: jest.fn(() => mockGesture),
    Rotation: jest.fn(() => mockGesture),
    Simultaneous: jest.fn(() => mockGesture),
  },
};
