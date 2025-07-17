import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import QuizHeader from "@/components/quiz/QuizHeader";
import QuizProgress from "@/components/quiz/QuizProgress";
import QuestionCard from "@/components/quiz/QuestionCard";
import QuizNavigation from "@/components/quiz/QuizNavigation";
import QuestionNavigator from "@/components/quiz/QuestionNavigator";
import ResultsModal from "@/components/quiz/ResultsModal";
import ReviewMode from "@/components/quiz/ReviewMode";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CheckCircle, BookOpen, RotateCcw, Trophy, User, Home, Settings } from "lucide-react";
import HomeConfirmModal from "@/components/quiz/HomeConfirmModal";
import QuestionsCatalog from "@/components/quiz/QuestionsCatalog";
import Leaderboard from "@/components/ui/leaderboard";

interface Question {
  id: number;
  question: string;
  options: Record<string, string>;
  answer: string;
  explanation?: string;
}

interface QuizSession {
  id: number;
  questionIds: number[];
  answers: Record<string, string>;
  score?: number;
  totalQuestions: number;
  completed: boolean;
  timeRemaining: number;
}

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

export default function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [markedQuestions, setMarkedQuestions] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null);
  const [lastQuizResults, setLastQuizResults] = useState<QuizResult | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showHomeConfirm, setShowHomeConfirm] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [questionCount, setQuestionCount] = useState(30);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [userName, setUserName] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Get user progress
  const { data: progress } = useQuery({
    queryKey: ["/api/user", currentUser?.id, "progress"],
    enabled: !quizStarted && !!currentUser,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (userName: string) => {
      const response = await apiRequest("POST", "/api/auth/login", { userName });
      return response.json();
    },
    onSuccess: (user: any) => {
      setCurrentUser(user);
      queryClient.invalidateQueries({ queryKey: ["/api/user", user.id, "progress"] });
    },
  });

  // Start quiz mutation
  const startQuizMutation = useMutation({
    mutationFn: async ({ count, userName }: { count: number; userName: string }) => {
      const response = await apiRequest("POST", "/api/quiz/start", { questionCount: count, userName });
      return response.json();
    },
    onSuccess: (session: QuizSession) => {
      setSessionId(session.id);
      // Set initial countdown time: 30 minutes for 30 questions, 60 minutes for 60 questions
      const initialTime = questionCount === 30 ? 30 * 60 : 60 * 60;
      setTimeRemaining(initialTime);
      setQuizStarted(true);
      setShowResults(false);
      setShowReview(false);
    },
  });

  // Get quiz session query
  const { data: quizData, isLoading } = useQuery({
    queryKey: ["/api/quiz", sessionId],
    enabled: !!sessionId,
  });

  // Update quiz session mutation
  const updateQuizMutation = useMutation({
    mutationFn: async (updates: { answers?: Record<string, string>; timeElapsed?: number }) => {
      const response = await apiRequest("PUT", `/api/quiz/${sessionId}`, updates);
      return response.json();
    },
  });

  // Submit quiz mutation
  const submitQuizMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/quiz/${sessionId}/submit`);
      return response.json();
    },
    onSuccess: (results: QuizResult) => {
      setQuizResults(results);
      setLastQuizResults(results);
      setShowResults(true);
      
      // Invalidate leaderboard cache to refresh scores
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard/global"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard/user", currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/user", currentUser?.id, "progress"] });
    },
  });

  // Timer effect - countdown from initial time
  useEffect(() => {
    if (!quizStarted || showResults || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up - auto submit
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, showResults, timeRemaining]);

  // Auto-save answers effect
  useEffect(() => {
    if (sessionId && Object.keys(selectedAnswers).length > 0) {
      const timeElapsed = (questionCount === 30 ? 30 * 60 : 60 * 60) - timeRemaining;
      updateQuizMutation.mutate({
        answers: selectedAnswers,
        timeElapsed
      });
    }
  }, [selectedAnswers, timeRemaining]);



  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quizData?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleMarkForReview = (questionId: number) => {
    setMarkedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleClearAnswer = (questionId: number) => {
    setSelectedAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });
  };

  const handleSubmitQuiz = () => {
    if (sessionId) {
      submitQuizMutation.mutate();
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setMarkedQuestions(new Set());
    setTimeRemaining(0);
    setShowResults(false);
    setShowReview(false);
    setQuizResults(null);
    setSessionId(null);
    setQuizStarted(false);
    // Start a new quiz immediately
    if (currentUser && currentUser.id !== 999) {
      startQuizMutation.mutate({ count: questionCount, userName: currentUser.displayName });
    }
  };

  const handleHomeClick = () => {
    setShowHomeConfirm(true);
  };

  const handleHomeConfirm = () => {
    setShowHomeConfirm(false);
    handleRestartQuiz();
  };

  const handleHomeCancel = () => {
    setShowHomeConfirm(false);
  };

  const handleShowReview = () => {
    setShowResults(false);
    setShowReview(true);
  };

  const handleCatalogClick = () => {
    setShowCatalog(true);
  };

  const handleCatalogClose = () => {
    setShowCatalog(false);
  };

  const handleLogin = () => {
    if (userName.trim()) {
      loginMutation.mutate(userName.trim());
    }
  };

  const handleStartQuiz = () => {
    if (currentUser) {
      startQuizMutation.mutate({ count: questionCount, userName: currentUser.displayName });
    }
  };

  const handleLeaderboardClick = () => {
    setShowLeaderboard(true);
  };

  const handleLeaderboardClose = () => {
    setShowLeaderboard(false);
  };

  const handleCompleteHomeClick = () => {
    setCurrentUser(null);
    setQuizStarted(false);
    setSessionId(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeRemaining(0);
    setQuizResults(null);
    setLastQuizResults(null);
    setShowReview(false);
    setShowHomeConfirm(false);
    setShowCatalog(false);
    setShowLeaderboard(false);
  };

  const handleSettingsClick = () => {
    if (showResults) {
      // If on results screen, go back to user selection but preserve results
      setShowResults(false);
      setShowReview(false);
      setQuizStarted(false);
      setSessionId(null);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setTimeRemaining(0);
      setShowHomeConfirm(false);
      // Keep lastQuizResults for "Back to Last Results" functionality
    } else {
      setQuizStarted(false);
      setSessionId(null);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setTimeRemaining(0);
      setQuizResults(null);
      setShowReview(false);
      setShowHomeConfirm(false);
      // Keep lastQuizResults for "Back to Last Results" functionality
    }
  };

  // Reset progress mutation
  const resetProgressMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/user/${currentUser?.id}/reset`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user", currentUser?.id, "progress"] });
    },
  });

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50/80 dark:bg-gray-900/80 flex items-center justify-center">
        <Card className="w-full max-w-md bg-slate-800/95 backdrop-blur-sm border-slate-700 shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">TOGAF 10 Part 1 Exam Preparation</h1>
              <p className="text-gray-300 mb-6">Enter your name to begin your certification journey</p>
              
              <div className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
                
                <Button 
                  onClick={handleLogin}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loginMutation.isPending || !userName.trim()}
                >
                  {loginMutation.isPending ? "Loading..." : "Continue"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Special handling for flush user
  if (currentUser.id === 999) {
    return (
      <div className="min-h-screen bg-slate-50/80 dark:bg-gray-900/80 flex items-center justify-center">
        <Card className="w-full max-w-md bg-slate-800/95 backdrop-blur-sm border-slate-700 shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Flush Successful</h1>
              <p className="text-gray-300 mb-6">All scoreboards and user progress have been cleared.</p>
              
              <Button 
                onClick={() => setCurrentUser(null)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Enter New Name
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-slate-50/80 dark:bg-gray-900/80 flex items-center justify-center">
        <Card className="w-full max-w-md bg-slate-800/95 backdrop-blur-sm border-slate-700 shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">TOGAF 10 Part 1 Practice Quiz</h1>
              <p className="text-gray-300 mb-2">Enterprise Architecture Foundation Certification</p>
              <p className="text-sm text-blue-400 mb-6">Welcome back, {currentUser.displayName}!</p>
              <p className="text-sm text-gray-400 mb-6">
                Practice with authentic TOGAF 10 Part 1 exam questions from our pool of 248+ certification questions. Select your preferred quiz length and test your knowledge.
              </p>
              
              {/* Progress Display */}
              {progress && (
                <div className="bg-slate-700 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-300">Your Progress</span>
                    <Button
                      onClick={() => resetProgressMutation.mutate()}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-gray-200"
                      disabled={resetProgressMutation.isPending}
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                  <div className="text-sm text-gray-400">
                    {progress.seenQuestions} / {progress.totalQuestions} questions completed ({progress.progressPercentage}%)
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress.progressPercentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {progress.unseenQuestions} unseen questions remaining
                  </div>
                </div>
              )}

              {/* Question Count Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Questions
                </label>
                <Select value={questionCount.toString()} onValueChange={(value) => setQuestionCount(parseInt(value))}>
                  <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select number of questions" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-white">
                    <SelectItem value="30">30 questions</SelectItem>
                    <SelectItem value="60">60 questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleStartQuiz}
                  disabled={startQuizMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {startQuizMutation.isPending ? "Starting..." : `Start Quiz (${questionCount} questions)`}
                </Button>
                

                
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    onClick={handleCatalogClick}
                    variant="outline"
                    className="w-full"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Catalog
                  </Button>
                  <Button 
                    onClick={handleLeaderboardClick}
                    variant="outline"
                    className="w-full"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Leaderboard
                  </Button>
                  <Button 
                    onClick={handleCompleteHomeClick}
                    variant="outline"
                    className="w-full"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Change User
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <QuestionsCatalog
          show={showCatalog}
          onClose={handleCatalogClose}
        />
        
        <Leaderboard
          show={showLeaderboard}
          onClose={handleLeaderboardClose}
          currentUserId={currentUser?.id}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-gray-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (showResults && quizResults) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Quiz Complete!
            </h1>
            <p className="text-slate-600 dark:text-gray-400">
              Great job completing the TOGAF certification quiz
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {quizResults.score}/{quizResults.totalQuestions}
                </div>
                <div className="text-sm text-slate-600 dark:text-gray-400">
                  Score
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {quizResults.percentage}%
                </div>
                <div className="text-sm text-slate-600 dark:text-gray-400">
                  Success Rate
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {(() => {
                    const elapsed = quizResults.timeElapsed || 0;
                    if (elapsed >= 60) {
                      const minutes = Math.floor(elapsed / 60);
                      const seconds = elapsed % 60;
                      return `${minutes}m ${seconds}s`;
                    }
                    return `${elapsed}s`;
                  })()}
                </div>
                <div className="text-sm text-slate-600 dark:text-gray-400">
                  Time Taken
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleShowReview}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Review Answers
            </Button>
            <Button
              onClick={handleRestartQuiz}
              variant="outline"
              className="border-slate-300 dark:border-gray-600"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Take Another Quiz
            </Button>
            <Button
              onClick={handleSettingsClick}
              variant="outline"
              className="border-slate-300 dark:border-gray-600"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showReview && quizResults) {
    return (
      <ReviewMode
        results={quizResults}
        questions={quizData?.questions || []}
        onBackToResults={() => {
          setShowReview(false);
          setShowResults(true);
        }}
      />
    );
  }

  const questions = quizData?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <QuizHeader timeRemaining={timeRemaining} onHomeClick={handleCompleteHomeClick} onCatalogClick={handleCatalogClick} onSettingsClick={handleSettingsClick} />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <QuizProgress
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          answeredCount={Object.keys(selectedAnswers).length}
        />

        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={selectedAnswers[currentQuestion.id]}
            onAnswerSelect={(answer) => handleAnswerSelect(currentQuestion.id, answer)}
          />
        )}

        <QuizNavigation
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          onPrevious={handlePreviousQuestion}
          onNext={handleNextQuestion}
          onMarkForReview={() => handleMarkForReview(currentQuestion?.id)}
          onClearAnswer={() => handleClearAnswer(currentQuestion?.id)}
          isMarked={markedQuestions.has(currentQuestion?.id)}
          hasAnswer={!!selectedAnswers[currentQuestion?.id]}
        />

        <QuestionNavigator
          questions={questions}
          currentQuestion={currentQuestionIndex}
          selectedAnswers={selectedAnswers}
          markedQuestions={markedQuestions}
          onQuestionJump={handleQuestionJump}
          onSubmitQuiz={handleSubmitQuiz}
          isSubmitting={submitQuizMutation.isPending}
        />
      </main>



      <HomeConfirmModal
        show={showHomeConfirm}
        onConfirm={handleHomeConfirm}
        onCancel={handleHomeCancel}
      />

      <QuestionsCatalog
        show={showCatalog}
        onClose={handleCatalogClose}
      />
    </div>
  );
}
