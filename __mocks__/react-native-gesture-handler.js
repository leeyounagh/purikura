// __mocks__/react-native-gesture-handler.js
const gestureMock = {
  onUpdate: jest.fn().mockReturnThis(),
  onEnd: jest.fn().mockReturnThis(),
  onStart: jest.fn().mockReturnThis(),
  onTouchesMove: jest.fn().mockReturnThis(),
  onTouchesDown: jest.fn().mockReturnThis(),
  onFinalize: jest.fn().mockReturnThis(),
};

module.exports = {
  GestureHandlerRootView: ({ children }) => children,
  GestureDetector: ({ children }) => children,
  Gesture: {
    Pan: () => ({ ...gestureMock }),
    Pinch: () => ({ ...gestureMock }),
    Simultaneous: (...gestures) => gestures,
  },
};
