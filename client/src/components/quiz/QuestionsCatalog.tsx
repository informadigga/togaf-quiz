import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { togafQuestions } from "@/data/questions";

interface QuestionsCatalogProps {
  show: boolean;
  onClose: () => void;
}

export default function QuestionsCatalog({ show, onClose }: QuestionsCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredQuestions = togafQuestions.filter(q =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    Object.values(q.options).some(option => 
      option.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] h-[80vh] bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>TOGAF Questions Catalog</span>
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-gray-400">
            Browse all {togafQuestions.length} questions in the quiz pool with correct answers highlighted in green
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col h-full overflow-hidden">
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Questions Count */}
          <div className="mb-4">
            <Badge variant="outline" className="text-slate-700 dark:text-gray-300 border-slate-300 dark:border-gray-600">
              {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''} 
              {searchTerm && ` found for "${searchTerm}"`}
            </Badge>
          </div>
          
          {/* Questions List */}
          <ScrollArea className="flex-1 h-full [&>[data-radix-scroll-area-viewport]]:max-h-none">
            <div className="space-y-6 pb-4 pr-4">
              {filteredQuestions.map((question, index) => (
                <Card key={index} className="shadow-sm border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex items-start space-x-3">
                        <Badge variant="secondary" className="mt-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {index + 1}
                        </Badge>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white leading-relaxed">
                          {question.question}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="space-y-2 ml-12">
                      {Object.entries(question.options).map(([key, value]) => (
                        <div
                          key={key}
                          className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                            key === question.answer
                              ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-600"
                              : "bg-slate-50 dark:bg-gray-700 border-slate-200 dark:border-gray-600"
                          }`}
                        >
                          <span className={`text-sm font-medium min-w-[20px] ${
                            key === question.answer
                              ? "text-emerald-800 dark:text-emerald-200"
                              : "text-slate-700 dark:text-gray-300"
                          }`}>
                            {key}.
                          </span>
                          <span className={`text-sm ${
                            key === question.answer
                              ? "text-emerald-800 dark:text-emerald-200 font-medium"
                              : "text-slate-700 dark:text-gray-300"
                          }`}>
                            {value}
                          </span>
                          {key === question.answer && (
                            <Badge className="ml-auto bg-emerald-100 text-emerald-800 dark:bg-emerald-800/30 dark:text-emerald-200">
                              Correct Answer
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="vertical" className="w-3 bg-slate-100 dark:bg-gray-700" />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}