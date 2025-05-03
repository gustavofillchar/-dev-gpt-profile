import { render, screen } from "@testing-library/react";
import Loading from "../loading-skeleton.component";

describe("Loading", () => {
  it("renders all skeleton elements", () => {
    render(<Loading />);

    const breadcrumbSkeletons = screen.getAllByTestId("skeleton");
    expect(breadcrumbSkeletons.length).toBeGreaterThan(0);

    const card = screen.getByTestId("card");
    expect(card).toBeInTheDocument();

    const contentSkeletons = screen.getAllByTestId("skeleton");
    expect(contentSkeletons.length).toBeGreaterThan(0);

    const rightSkeleton = screen.getAllByTestId("skeleton");
    expect(rightSkeleton.length).toBeGreaterThan(0);
  });
}); 