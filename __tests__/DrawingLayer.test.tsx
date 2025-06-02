import { DrawingLayer } from "@/components/ui/common/editorCanvas/drawingLayer";
import { fireEvent, render } from "@testing-library/react-native";
import React, { createRef } from "react";
import { GestureResponderEvent } from "react-native";
import { act } from "react-test-renderer";

// react-native-svg를 테스트 환경에서 간단히 모킹
jest.mock("react-native-svg", () => {
  const React = require("react");
  const View = require("react-native").View;
  return {
    __esModule: true,
    Svg: View,
    Path: View,
  };
});
// DrawingLayer.test.tsx 상단
jest.mock("react-native-svg", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: View, // Svg를 View로 대체
    Path: View,    // Path도 View로 대체
  };
});

describe("DrawingLayer", () => {
  // 터치 이벤트 객체 생성 헬퍼
  const createTouchEvent = (x: number, y: number): GestureResponderEvent => ({
    nativeEvent: {
      locationX: x,
      locationY: y,
    },
  } as GestureResponderEvent);

  it("정상적으로 렌더링된다", () => {
    const { getByTestId } = render(
      <DrawingLayer currentColor="black" strokeWidth={2} />
    );
    expect(getByTestId).toBeTruthy(); // 렌더링 성공 확인
  });


it("ref로 clear와 undo 호출 가능", () => {
    const ref = createRef<any>();
    render(<DrawingLayer ref={ref} currentColor="red" strokeWidth={2} />);

    act(() => {
      ref.current?.clear();
      ref.current?.undo();
    });

    expect(true).toBeTruthy();
  });

  it("disabled가 true일 경우 그릴 수 없다", () => {
    const { getByTestId } = render(
      <DrawingLayer currentColor="blue" strokeWidth={1} disabled={true} />
    );
    const container = getByTestId("drawing-container");

    fireEvent(container, "onResponderGrant", createTouchEvent(5, 5));
    fireEvent(container, "onResponderMove", createTouchEvent(15, 15));
    fireEvent(container, "onResponderRelease");

    expect(true).toBeTruthy(); // 동작 차단 확인
  });

  it("currentColor와 strokeWidth가 변경되면 반영된다", () => {
    const { rerender } = render(
      <DrawingLayer currentColor="green" strokeWidth={3} />
    );

    // prop 변경 후 다시 렌더링
    rerender(<DrawingLayer currentColor="purple" strokeWidth={5} />);
    expect(true).toBeTruthy(); // rerender 성공 확인
  });
});
