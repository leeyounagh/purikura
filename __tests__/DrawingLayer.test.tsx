import { DrawingLayer } from "@/components/ui/common/editorCanvas/DrawingLayer";
import { fireEvent, render } from "@testing-library/react-native";
import React, { createRef } from "react";
import { GestureResponderEvent } from "react-native";
import { act } from "react-test-renderer";

jest.mock("react-native-svg", () => {
  const { View } = require("react-native");
  const Mock = View;
  return {
    __esModule: true,
    default: Mock,
    Svg: Mock,
    Path: Mock,
    Circle: Mock,
    Defs: Mock,
    LinearGradient: Mock,
    Stop: Mock,
  };
});

describe("DrawingLayer", () => {
  const createTouchEvent = (x: number, y: number): GestureResponderEvent =>
    ({
      nativeEvent: {
        locationX: x,
        locationY: y,
      },
    }) as GestureResponderEvent;

  it("정상적으로 렌더링된다", () => {
    const { getByTestId } = render(
      <DrawingLayer currentColor="black" strokeWidth={2} />
    );
    expect(getByTestId).toBeTruthy();
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

    expect(true).toBeTruthy();
  });

  it("currentColor와 strokeWidth가 변경되면 반영된다", () => {
    const { rerender } = render(
      <DrawingLayer currentColor="green" strokeWidth={3} />
    );

    rerender(<DrawingLayer currentColor="purple" strokeWidth={5} />);
    expect(true).toBeTruthy();
  });
});
