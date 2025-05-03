import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorComponentProps {
  message: string;
}

export default function ErrorComponent({ message }: ErrorComponentProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md" data-testid="error-card">
        <CardHeader data-testid="error-card-header">
          <CardTitle className="text-center">Oops!</CardTitle>
        </CardHeader>
        <CardContent data-testid="error-card-content">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" data-testid="alert-circle-icon" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription data-testid="alert-description">
              {message}
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-center" data-testid="error-card-footer">
          <Button 
            onClick={() => router.push("/")}
            variant="default"
          >
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 