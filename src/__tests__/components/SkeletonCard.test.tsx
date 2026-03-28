import React from "react";
import { render } from "@testing-library/react-native";
import { Skeleton, SkeletonCard, SkeletonStats, SkeletonDetail } from "../../components/Skeleton";

describe("Skeleton components", () => {
  it("Skeleton renders without crash", () => {
    const { toJSON } = render(<Skeleton />);
    expect(toJSON()).toBeTruthy();
  });

  it("Skeleton respects custom props", () => {
    const { toJSON } = render(
      <Skeleton width={200} height={24} borderRadius={12} color="#ccc" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it("SkeletonCard renders without crash", () => {
    const { toJSON } = render(<SkeletonCard />);
    expect(toJSON()).toBeTruthy();
  });

  it("SkeletonCard renders in dark mode", () => {
    const { toJSON } = render(<SkeletonCard dark />);
    expect(toJSON()).toBeTruthy();
  });

  it("SkeletonStats renders with default count", () => {
    const { toJSON } = render(<SkeletonStats />);
    expect(toJSON()).toBeTruthy();
  });

  it("SkeletonStats renders with custom count", () => {
    const { toJSON } = render(<SkeletonStats count={2} />);
    expect(toJSON()).toBeTruthy();
  });

  it("SkeletonDetail renders without crash", () => {
    const { toJSON } = render(<SkeletonDetail />);
    expect(toJSON()).toBeTruthy();
  });

  it("SkeletonDetail renders in dark mode", () => {
    const { toJSON } = render(<SkeletonDetail dark />);
    expect(toJSON()).toBeTruthy();
  });
});
