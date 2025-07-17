import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface HomeConfirmModalProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function HomeConfirmModal({ show, onConfirm, onCancel }: HomeConfirmModalProps) {
  return (
    <Dialog open={show} onOpenChange={onCancel}>
      <DialogContent className="max-w-md bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>Go to Home?</span>
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-gray-400">
            Are you sure you want to go back to the start? Your current progress will be lost.
          </DialogDescription>
        </DialogHeader>
        <div className="flex space-x-3 mt-6">
          <Button 
            onClick={onCancel} 
            variant="outline" 
            className="flex-1 border-slate-200 dark:border-gray-600 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            variant="destructive" 
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            Go to Home
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}