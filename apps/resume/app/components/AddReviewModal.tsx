import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@resume/ui/dialog";
import { Button } from "@resume/ui/button";
import { Textarea } from "@resume/ui/textarea";
import { Input } from "@resume/ui/input";
import { Label } from "@resume/ui/label";
import { Star, Upload, Sparkles } from "lucide-react";
import { useToast } from "@resume/ui/hooks/use-toast";
import { useCompletion } from "ai/react";

interface Review {
  id: string;
  text: string;
  rating: number;
  displayName?: string | null;
  pictureUrl?: string | null;
  twitterHandle?: string | null;
  linkedinUrl?: string | null;
  createdAt: Date;
}

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: (review: Review) => void;
}

export default function AddReviewModal({
  isOpen,
  onClose,
  onReviewSubmitted,
}: AddReviewModalProps) {
  const [formData, setFormData] = useState({
    text: "",
    rating: 5,
    displayName: "",
    twitterHandle: "",
    linkedinUrl: "",
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { complete, completion, isLoading } = useCompletion({
    api: '/api/generate-review',
    onFinish: (completion) => {
      setFormData(prev => ({ ...prev, text: completion }));
    },
  });

  const prompt = `Generate an authentic and balanced review for a resume builder application. 
  The review should:
  - Be 1-2 lines long
  - Mention specific features and their benefits
  - Include both strengths and potential areas for improvement
  - Use a natural, conversational tone
  - Focus on the user experience
  - Dont need to add a heading like "Review" or "Feedback", just write the review text
  Keep the overall tone positive but realistic.`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text.trim()) {
      toast({
        variant: "destructive",
        description: "Please enter your review text",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) form.append(key, value.toString());
      });

      if (profilePicture) {
        form.append("profilePicture", profilePicture);
      }

      const response = await fetch("/api/reviews", {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const newReview = await response.json();
      onReviewSubmitted(newReview);

      setFormData({
        text: "",
        rating: 5,
        displayName: "",
        twitterHandle: "",
        linkedinUrl: "",
      });
      setProfilePicture(null);
      onClose();
      toast({
        description: "Thank you for your review!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to submit review. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] bg-[#fafafa] dark:bg-[#27272a] backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle>Share Your Experience</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Rating</Label>
            <div className="flex gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating: i + 1 }))}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      i < formData.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Your Review</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => complete(prompt)}
                disabled={isLoading}
                className="flex gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {isLoading ? "Generating..." : "Generate with AI"}
              </Button>
            </div>
            <Textarea
              value={isLoading ? completion : formData.text}
              onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Share your experience..."
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Display Name (optional)</Label>
              <Input
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="How should we display your name?"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Profile Picture (optional)</Label>
              <div className="mt-1 flex items-center gap-4">
                {profilePicture ? (
                  <div className="relative w-12 h-12">
                    <img
                      src={URL.createObjectURL(profilePicture)}
                      alt="Profile preview"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setProfilePicture(null)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ) :
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
                          setProfilePicture(file);
                        } else {
                          toast({
                            variant: "destructive",
                            description: "Image size should be less than 5MB",
                          });
                        }
                      }}
                    />
                  </label>
                }
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Twitter Handle (optional)</Label>
              <Input
                value={formData.twitterHandle}
                onChange={(e) => setFormData(prev => ({ ...prev, twitterHandle: e.target.value.replace('@', '') }))}
                placeholder="Without @"
                className="mt-1"
              />
            </div>

            <div>
              <Label>LinkedIn URL (optional)</Label>
              <Input
                value={formData.linkedinUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                placeholder="Your LinkedIn profile"
                className="mt-1"
                type="url"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 