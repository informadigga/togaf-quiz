import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuizNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onMarkForReview: () => void;
  onClearAnswer: () => void;
  isMarked: boolean;
  hasAnswer: boolean;
}

export default function QuizNavigation({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onMarkForReview,
  onClearAnswer,
  isMarked,
  hasAnswer,
}: QuizNavigationProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentQuestion === 1}
        className="flex items-center space-x-2 border-slate-200 dark:border-gray-600 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Previous</span>
      </Button>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onMarkForReview}
          className={isMarked ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-600" : "border-slate-200 dark:border-gray-600 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700"}
        >
          {isMarked ? "Unmark" : "Mark for Review"}
        </Button>
        {hasAnswer && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAnswer}
            className="border-slate-200 dark:border-gray-600 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700"
          >
            Clear Answer
          </Button>
        )}
      </div>
      
      <Button
        onClick={onNext}
        disabled={currentQuestion === totalQuestions}
        className="flex items-center space-x-2"
      >
        <span>Next</span>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
