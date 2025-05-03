import { render, screen } from "@testing-library/react";
import Header from "../header.component";

describe("Header", () => {
  it("renders the header with navigation links", () => {
    render(<Header />);

    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");

    const companyProfileText = screen.getByText("Company Profile");
    expect(companyProfileText).toBeInTheDocument();
  });
}); 