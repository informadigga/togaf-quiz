import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

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

interface ResultsModalProps {
  show: boolean;
  results: QuizResult | null;
  onClose: () => void;
  onReviewAnswers: () => void;
  onRetakeQuiz: () => void;
}

export default function ResultsModal({
  show,
  results,
  onClose,
  onReviewAnswers,
  onRetakeQuiz,
}: ResultsModalProps) {
  if (!results) return null;

  const incorrectAnswers = results.totalQuestions - results.score;

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-slate-900 dark:text-white">Quiz Completed!</DialogTitle>
          <DialogDescription className="text-center text-slate-600 dark:text-gray-400">
            Your quiz results and performance summary
          </DialogDescription>
        </DialogHeader>
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-slate-600 dark:text-gray-400 mb-6">
            Congratulations on completing the TOGAF certification quiz.
          </p>
          
          <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{results.score}</div>
                <div className="text-sm text-slate-600 dark:text-gray-400">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">{incorrectAnswers}</div>
                <div className="text-sm text-slate-600 dark:text-gray-400">Incorrect</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-gray-600">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{results.percentage}%</div>
              <div className="text-sm text-slate-600 dark:text-gray-400">Overall Score</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button onClick={onReviewAnswers} className="w-full">
              Review Answers
            </Button>
            <Button onClick={onRetakeQuiz} variant="outline" className="w-full border-slate-200 dark:border-gray-600 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700">
              Retake Quiz
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
