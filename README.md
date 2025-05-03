# Company Profile Generator

This project is a Next.js application that generates company profiles by analyzing website content using OpenAI's GPT model. It provides a user-friendly interface to input company information and download structured profile data.

## Features

- Website content analysis using OpenAI GPT
- Dynamic form for company profile information
- Multiple email management
- JSON profile download
- Responsive design with modern UI
- Comprehensive test coverage

## Prerequisites

- Node.js 18.x or later
- pnpm
- OpenAI API key

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```bash
# OpenAI API Key - Required for content analysis
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Set to 'development' or 'production'
NODE_ENV=development
```

## Installation

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```

## Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

This project uses Jest and React Testing Library for testing. The test suite includes:

- Component rendering tests
- User interaction tests
- Form validation tests
- API integration tests
- Error handling tests

Run the tests with:

```bash
pnpm test
```

The tests are located in the `__tests__` directories alongside their respective components.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── company-profile/    # Company profile page
│   └── page.tsx           # Home page
├── components/            # Reusable components
├── services/             # API and business logic
└── types/               # TypeScript type definitions
```

## Technologies Used

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Jest
- React Testing Library
- OpenAI API
- pnpm

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
