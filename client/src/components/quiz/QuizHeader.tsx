import { Clock, Home, BookOpen, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizHeaderProps {
  timeRemaining: number;
  onHomeClick: () => void;
  onCatalogClick: () => void;
  onSettingsClick: () => void;
}

export default function QuizHeader({ timeRemaining, onHomeClick, onCatalogClick, onSettingsClick }: QuizHeaderProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-slate-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-white">TOGAF Certification Quiz</h1>
              <p className="text-sm text-slate-600 dark:text-gray-400">Enterprise Architecture Foundation</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
              <Clock className="w-5 h-5 text-slate-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {formatTime(timeRemaining)}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={onCatalogClick} title="Questions Catalog">
              <BookOpen className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onSettingsClick} title="Quiz Settings">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onHomeClick} title="Go to Home">
              <Home className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
