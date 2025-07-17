import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  results: Array<{
    questionId: number;
    question: string;
    options: Record<string, string>;
    correctAnswer: string;
    userAnswer: string | null;
    isCorrect: boolean;
  }>;
}

interface ReviewModeProps {
  results: QuizResult;
  questions: any[];
  onBackToResults: () => void;
}

export default function ReviewMode({ results, onBackToResults }: ReviewModeProps) {
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const currentResult = results.results[currentResultIndex];

  const handleNext = () => {
    if (currentResultIndex < results.results.length - 1) {
      setCurrentResultIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentResultIndex > 0) {
      setCurrentResultIndex(prev => prev - 1);
    }
  };

  const getOptionClass = (key: string) => {
    if (key === currentResult.correctAnswer) {
      return "border-2 border-emerald-200 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20";
    }
    if (key === currentResult.userAnswer && !currentResult.isCorrect) {
      return "border-2 border-red-200 dark:border-red-600 bg-red-50 dark:bg-red-900/20";
    }
    return "border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-700";
  };

  const getOptionIcon = (key: string) => {
    if (key === currentResult.correctAnswer) {
      return <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
    }
    if (key === currentResult.userAnswer && !currentResult.isCorrect) {
      return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
    }
    return <div className="w-5 h-5 bg-slate-200 dark:bg-gray-600 rounded-full" />;
  };

  const getOptionTextColor = (key: string): string => {
    if (key === currentResult.correctAnswer) {
      return "text-emerald-800 dark:text-emerald-200";
    } else if (key === currentResult.userAnswer && !currentResult.isCorrect) {
      return "text-red-800 dark:text-red-200";
    }
    return "text-slate-700 dark:text-gray-300";
  };

  const getOptionLabel = (key: string) => {
    if (key === currentResult.correctAnswer) {
      return <span className="text-xs bg-emerald-100 dark:bg-emerald-800/30 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded">Correct</span>;
    }
    if (key === currentResult.userAnswer && !currentResult.isCorrect) {
      return <span className="text-xs bg-red-100 dark:bg-red-800/30 text-red-800 dark:text-red-200 px-2 py-1 rounded">Your Answer</span>;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-slate-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={onBackToResults} className="border-slate-200 dark:border-gray-600 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Results
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
                Question {currentResultIndex + 1} of {results.results.length}
              </span>
              <div className="w-6 h-6 rounded-full flex items-center justify-center">
                {currentResult.isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-6 shadow-sm border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
                {currentResult.question}
              </h3>
              
              <div className="space-y-3">
                {Object.entries(currentResult.options).map(([key, value]) => (
                  <div key={key} className={`flex items-start space-x-3 p-3 rounded-lg ${getOptionClass(key)}`}>
                    {getOptionIcon(key)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${getOptionTextColor(key)}`}>{key}.</span>
                        <span className={`text-sm ${getOptionTextColor(key)}`}>{value}</span>
                        {getOptionLabel(key)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-400 mb-2">Answer:</h4>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                The correct answer is <strong>{currentResult.correctAnswer}</strong>. 
                {currentResult.userAnswer 
                  ? ` You selected ${currentResult.userAnswer}.`
                  : " You did not provide an answer."
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentResultIndex === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>
          
          <div className="flex flex-wrap gap-2 max-w-2xl">
            {results.results.map((_, index) => (
              <Button
                key={index}
                variant={index === currentResultIndex ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentResultIndex(index)}
                className={`w-8 h-8 p-0 text-xs ${
                  results.results[index].isCorrect 
                    ? index === currentResultIndex 
                      ? "bg-emerald-600 hover:bg-emerald-700" 
                      : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    : index === currentResultIndex
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                {index + 1}
              </Button>
            ))}
          </div>
          
          <Button
            onClick={handleNext}
            disabled={currentResultIndex === results.results.length - 1}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
