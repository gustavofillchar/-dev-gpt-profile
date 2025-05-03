import { render, screen } from "@testing-library/react";
import Loading from "../loading-skeleton.component";

describe("Loading", () => {
  it("renders all skeleton elements", () => {
    render(<Loading />);

    // Verifica se os skeletons do breadcrumb estão presentes
    const breadcrumbSkeletons = screen.getAllByTestId("skeleton");
    expect(breadcrumbSkeletons.length).toBeGreaterThan(0);

    // Verifica se o card está presente
    const card = screen.getByTestId("card");
    expect(card).toBeInTheDocument();

    // Verifica se os skeletons do conteúdo estão presentes
    const contentSkeletons = screen.getAllByTestId("skeleton");
    expect(contentSkeletons.length).toBeGreaterThan(0);

    // Verifica se o skeleton do lado direito está presente
    const rightSkeleton = screen.getAllByTestId("skeleton");
    expect(rightSkeleton.length).toBeGreaterThan(0);
  });
}); 