interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredCount: number;
}

export default function QuizProgress({ currentQuestion, totalQuestions, answeredCount }: QuizProgressProps) {
  const progressPercentage = (answeredCount / totalQuestions) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
          Question {currentQuestion} of {totalQuestions}
        </span>
        <span className="text-sm text-slate-600 dark:text-gray-400">
          {answeredCount} completed
        </span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
