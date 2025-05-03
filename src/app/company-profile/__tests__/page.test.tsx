import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import CompanyProfile from "../page";
import { fetchWebsiteData, analyzeContent, downloadProfile } from "@/services/company-profile.service";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));
 
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => '123e4567-e89b-12d3-a456-426614174000'
  }
});
 
jest.mock("@/services/company-profile.service", () => ({
  fetchWebsiteData: jest.fn(),
  analyzeContent: jest.fn(),
  downloadProfile: jest.fn(),
}));

describe("CompanyProfile", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockSearchParams = new URLSearchParams();
  mockSearchParams.set("url", "https://example.com");

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    (fetchWebsiteData as jest.Mock).mockResolvedValue("<html>Test HTML</html>");
    (analyzeContent as jest.Mock).mockResolvedValue({
      company_name: "Test Company",
      company_description: "Test Description",
      service_lines: [],
      tier1_keywords: ["keyword1"],
      tier2_keywords: ["keyword2"],
      emails: [""],
      poc: "",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to home when no URL is provided", async () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
    render(<CompanyProfile />);
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/");
    });
  });

  it("shows loading state initially", () => {
    render(<CompanyProfile />);
    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("shows error state when fetch fails", async () => {
    (fetchWebsiteData as jest.Mock).mockRejectedValue(new Error("Fetch failed"));
    
    render(<CompanyProfile />);
    
    await waitFor(() => {
      expect(screen.getByText("Oops!")).toBeInTheDocument();
    });
  });

  it("renders form with initial data after loading", async () => {
    render(<CompanyProfile />);

    await waitFor(() => {
      expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/company description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/point of contact/i)).toBeInTheDocument();
    });
  });

  it("allows adding and removing emails", async () => {
    render(<CompanyProfile />);

     await waitFor(() => {
      expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
    });

    
    const emailInput = screen.getByTestId("email-input");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const addEmailButton = screen.getByTestId("add-email-button");
    fireEvent.click(addEmailButton);

    const emailInputs = screen.getAllByTestId("email-input");
    fireEvent.change(emailInputs[1], { target: { value: "test2@example.com" } });

    const removeButtons = screen.getAllByTestId("remove-email-button");
    fireEvent.click(removeButtons[1]);

    const emailInputsAfter = screen.getAllByTestId("email-input");
    expect(emailInputsAfter).toHaveLength(1);
  });

  it("downloads profile when form is submitted", async () => {
    render(<CompanyProfile />);

    await waitFor(() => {
      expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
    });

    const companyNameInput = screen.getByLabelText(/company name/i);
    const descriptionInput = screen.getByLabelText(/company description/i);
    const contactInput = screen.getByLabelText(/point of contact/i);
    const emailInput = screen.getByTestId("email-input");

    fireEvent.change(companyNameInput, { target: { value: "Test Company" } });
    fireEvent.change(descriptionInput, { target: { value: "Test Description" } });
    fireEvent.change(contactInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByTestId("download-json-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(downloadProfile).toHaveBeenCalledWith({
        company_name: "Test Company",
        company_description: "Test Description",
        service_lines: [],
        tier1_keywords: ["keyword1"],
        tier2_keywords: ["keyword2"],
        emails: ["test@example.com"],
        poc: "John Doe"
      });
    });
  });

  it("updates form fields correctly", async () => {
    render(<CompanyProfile />);

    await waitFor(() => {
      expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
    });

    const companyNameInput = screen.getByLabelText(/company name/i);
    fireEvent.change(companyNameInput, { target: { value: "Updated Company" } });

    const descriptionInput = screen.getByLabelText(/company description/i);
    fireEvent.change(descriptionInput, { target: { value: "Updated Description" } });

    const pocInput = screen.getByLabelText(/point of contact/i);
    fireEvent.change(pocInput, { target: { value: "John Doe" } });

    await waitFor(() => {
      expect(companyNameInput).toHaveValue("Updated Company");
      expect(descriptionInput).toHaveValue("Updated Description");
      expect(pocInput).toHaveValue("John Doe");
    });
  });
}); 