import { fetchWebsiteData, analyzeContent, downloadProfile } from '../company-profile.service';
import type { CompanyProfile } from '@/types/company-profile';

// Mock fetch globally
global.fetch = jest.fn();

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'mock-uuid-123'
  }
});

describe('Company Profile Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('fetchWebsiteData', () => {
    it('should fetch website data successfully', async () => {
      const mockHtml = '<html>Test HTML</html>';
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ rawHtml: mockHtml }),
      });

      const result = await fetchWebsiteData('https://example.com');
      expect(result).toBe(mockHtml);
      expect(global.fetch).toHaveBeenCalledWith('/api/scrape?url=https%3A%2F%2Fexample.com');
    });

    it('should throw error when fetch fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(fetchWebsiteData('https://example.com')).rejects.toThrow('Failed to fetch website data');
    });
  });

  describe('analyzeContent', () => {
    it('should analyze content successfully', async () => {
      const mockAnalysis = {
        analysis: {
          company_name: 'Test Company',
          service_lines: ['Service 1', 'Service 2'],
          company_description: 'Test description',
          tier1_keywords: ['keyword1'],
          tier2_keywords: ['keyword2'],
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAnalysis),
      });

      const result = await analyzeContent('<html>Test HTML</html>');
      
      expect(result).toEqual({
        company_name: 'Test Company',
        service_lines: expect.arrayContaining([
          expect.objectContaining({ name: 'Service 1' }),
          expect.objectContaining({ name: 'Service 2' }),
        ]),
        company_description: 'Test description',
        tier1_keywords: ['keyword1'],
        tier2_keywords: ['keyword2'],
      });
    });

    it('should throw error when analysis fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(analyzeContent('<html>Test HTML</html>')).rejects.toThrow('Failed to analyze content');
    });
  });

  describe('downloadProfile', () => {
    it('should create and trigger download of profile', () => {
      // Mock DOM elements and methods
      const mockAppendChild = jest.fn();
      const mockRemoveChild = jest.fn();
      const mockClick = jest.fn();
      
      document.body.appendChild = mockAppendChild;
      document.body.removeChild = mockRemoveChild;
      
      const mockProfile: CompanyProfile = {
        company_name: 'Test Company',
        service_lines: [{ id: '1', name: 'Service 1' }],
        company_description: 'Test description',
        tier1_keywords: ['keyword1'],
        tier2_keywords: ['keyword2'],
        emails: ['test@example.com'],
        poc: 'John Doe'
      };

      // Mock URL.createObjectURL and URL.revokeObjectURL
      const mockUrl = 'blob:test-url';
      URL.createObjectURL = jest.fn().mockReturnValue(mockUrl);
      URL.revokeObjectURL = jest.fn();

      // Mock createElement
      document.createElement = jest.fn().mockReturnValue({
        href: '',
        download: '',
        click: mockClick,
      });

      downloadProfile(mockProfile);

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalled();
      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockUrl);
    });
  });
}); 