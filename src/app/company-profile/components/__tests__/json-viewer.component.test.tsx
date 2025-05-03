import { render, screen } from "@testing-library/react";
import JsonViewer from "../json-viewer.component";
import { CompanyProfile } from "@/types/company-profile";

describe("JsonViewer", () => {
  const mockData: CompanyProfile = {
    company_name: "Test Company",
    company_description: "Test Description",
    service_lines: [
      { id: "1", name: "Service 1" },
      { id: "2", name: "Service 2" }
    ],
    tier1_keywords: ["keyword1", "keyword2"],
    tier2_keywords: ["keyword3", "keyword4"],
    emails: ["test@company.com"],
    poc: "John Doe"
  };

  it("renders the formatted JSON data", () => {
    render(<JsonViewer data={mockData} />);

    // Verifica se o código está presente
    const codeBlock = screen.getByTestId("json-viewer");
    expect(codeBlock).toBeInTheDocument();

    // Verifica se os dados foram formatados corretamente
    const expectedOutput = {
      ...mockData,
      service_lines: mockData.service_lines.map(sl => sl.name)
    };
    expect(JSON.parse(codeBlock.textContent || "")).toEqual(expectedOutput);
  });
}); 