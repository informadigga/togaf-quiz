import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Question {
  id: number;
  question: string;
  options: Record<string, string>;
  answer: string;
}

interface QuestionNavigatorProps {
  questions: Question[];
  currentQuestion: number;
  selectedAnswers: Record<string, string>;
  markedQuestions: Set<number>;
  onQuestionJump: (index: number) => void;
  onSubmitQuiz: () => void;
  isSubmitting: boolean;
}

export default function QuestionNavigator({
  questions,
  currentQuestion,
  selectedAnswers,
  markedQuestions,
  onQuestionJump,
  onSubmitQuiz,
  isSubmitting,
}: QuestionNavigatorProps) {
  const getQuestionStatus = (index: number, questionId: number) => {
    if (index === currentQuestion) return "current";
    if (selectedAnswers[questionId]) return "answered";
    if (markedQuestions.has(questionId)) return "marked";
    return "unanswered";
  };

  const getButtonClass = (status: string) => {
    switch (status) {
      case "current":
        return "bg-blue-600 text-white hover:bg-blue-700";
      case "answered":
        return "bg-emerald-500 text-white hover:bg-emerald-600";
      case "marked":
        return "bg-amber-500 text-white hover:bg-amber-600";
      default:
        return "bg-slate-200 text-slate-700 hover:bg-slate-300";
    }
  };

  return (
    <Card className="shadow-sm border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Question Navigator</h3>
        <div className="grid grid-cols-10 gap-2 mb-4">
          {questions.map((question, index) => {
            const status = getQuestionStatus(index, question.id);
            return (
              <Button
                key={question.id}
                variant="outline"
                size="sm"
                onClick={() => onQuestionJump(index)}
                className={`w-8 h-8 p-0 text-xs font-medium transition-colors ${getButtonClass(status)}`}
              >
                {index + 1}
              </Button>
            );
          })}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-gray-600">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 dark:bg-blue-500 rounded"></div>
              <span className="text-slate-600 dark:text-gray-400">Current</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded"></div>
              <span className="text-slate-600 dark:text-gray-400">Answered</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-500 rounded"></div>
              <span className="text-slate-600 dark:text-gray-400">Marked</span>
            </div>
          </div>
          <Button
            onClick={onSubmitQuiz}
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
