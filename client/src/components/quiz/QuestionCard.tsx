import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Question {
  id: number;
  question: string;
  options: Record<string, string>;
  answer: string;
}

interface QuestionCardProps {
  question: Question;
  selectedAnswer?: string;
  onAnswerSelect: (answer: string) => void;
}

export default function QuestionCard({ question, selectedAnswer, onAnswerSelect }: QuestionCardProps) {
  return (
    <Card className="mb-6 shadow-sm border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            {question.question}
          </h2>
          
          <RadioGroup value={selectedAnswer} onValueChange={onAnswerSelect}>
            <div className="space-y-3">
              {Object.entries(question.options).map(([key, value]) => (
                <div key={key} className="flex items-start space-x-3">
                  <Label
                    htmlFor={`option-${key}`}
                    className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors w-full"
                  >
                    <RadioGroupItem
                      id={`option-${key}`}
                      value={key}
                      className="mt-1 text-blue-600 dark:text-blue-400"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-gray-300">{key}.</span>
                        <span className="text-sm text-slate-900 dark:text-white">{value}</span>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
