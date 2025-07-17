import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Clock, Target, X } from "lucide-react";

interface LeaderboardProps {
  show: boolean;
  onClose: () => void;
  currentUserId?: number;
}

interface GlobalLeaderboardEntry {
  displayName: string;
  score: number;
  percentage: number;
  totalQuestions: number;
  timeElapsed: number;
  createdAt: Date;
}

interface UserLeaderboardEntry {
  score: number;
  percentage: number;
  totalQuestions: number;
  timeElapsed: number;
  createdAt: Date;
}

export default function Leaderboard({ show, onClose, currentUserId }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'global' | 'personal'>('personal');
  const [questionCount, setQuestionCount] = useState<30 | 60>(30);

  const { data: globalLeaderboard, isLoading: globalLoading } = useQuery<GlobalLeaderboardEntry[]>({
    queryKey: ["/api/leaderboard/global", questionCount],
    queryFn: async () => {
      const response = await fetch(`/api/leaderboard/global?questionCount=${questionCount}`);
      return response.json();
    },
    enabled: show && activeTab === 'global',
  });

  const { data: personalLeaderboard, isLoading: personalLoading } = useQuery<UserLeaderboardEntry[]>({
    queryKey: ["/api/leaderboard/user", currentUserId, questionCount],
    queryFn: async () => {
      const response = await fetch(`/api/leaderboard/user/${currentUserId}?questionCount=${questionCount}`);
      return response.json();
    },
    enabled: show && activeTab === 'personal' && !!currentUserId,
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-slate-500">#{rank}</span>;
    }
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden bg-white/95 backdrop-blur-sm">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold text-slate-900">
            Hall of Fame
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-3 mb-4">
          <div className="flex space-x-1">
            <Button
              variant={activeTab === 'personal' ? 'default' : 'outline'}
              onClick={() => setActiveTab('personal')}
              className="flex-1"
              disabled={!currentUserId}
            >
              👤 Personal Best 10
            </Button>
            <Button
              variant={activeTab === 'global' ? 'default' : 'outline'}
              onClick={() => setActiveTab('global')}
              className="flex-1"
            >
              🌍 Global Top 10
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Question Count:</span>
            <Button 
              variant={questionCount === 30 ? 'default' : 'outline'}
              onClick={() => setQuestionCount(30)}
              size="sm"
            >
              30 Questions
            </Button>
            <Button 
              variant={questionCount === 60 ? 'default' : 'outline'}
              onClick={() => setQuestionCount(60)}
              size="sm"
            >
              60 Questions
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[50vh] space-y-2">
          {activeTab === 'personal' && (
            <>
              {personalLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : personalLeaderboard?.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No quiz results yet. Take a quiz to see your personal leaderboard!
                </div>
              ) : (
                personalLeaderboard?.map((entry, index) => (
                  <Card key={index} className="bg-white/80 backdrop-blur-sm border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getRankIcon(index + 1)}
                          <div>
                            <div className="font-semibold text-slate-900">
                              Quiz #{index + 1}
                            </div>
                            <div className="text-sm text-slate-600">
                              {entry.totalQuestions} questions • {new Date(entry.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <Target className="w-3 h-3 mr-1" />
                            {entry.score}/{entry.totalQuestions}
                          </Badge>
                          <Badge variant="outline" className="text-slate-600">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(entry.timeElapsed)}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </>
          )}

          {activeTab === 'global' && (
            <>
              {globalLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                globalLeaderboard?.map((entry, index) => (
                  <Card key={index} className="bg-white/80 backdrop-blur-sm border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getRankIcon(index + 1)}
                          <div>
                            <div className="font-semibold text-slate-900">{entry.displayName}</div>
                            <div className="text-sm text-slate-600">
                              {entry.totalQuestions} questions
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <Target className="w-3 h-3 mr-1" />
                            {entry.score}/{entry.totalQuestions}
                          </Badge>
                          <Badge variant="outline" className="text-slate-600">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(entry.timeElapsed)}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}