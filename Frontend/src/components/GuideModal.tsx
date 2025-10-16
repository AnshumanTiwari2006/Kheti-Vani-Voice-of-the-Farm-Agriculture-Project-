// ========================== GuideModal.tsx ==========================
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Info } from "lucide-react";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string; // Pass localized text from caller
}

export default function GuideModal({ isOpen, onClose, title, description }: GuideModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-primary/20 shadow-lg">
        <DialogHeader className="text-center space-y-3">
          <div className="flex items-center justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <Info className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-primary">
            {title}
          </DialogTitle>
          <DialogDescription className="text-base text-foreground leading-relaxed whitespace-pre-wrap">
            {description}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
