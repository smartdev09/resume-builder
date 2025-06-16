import { useState } from "react";
import { Button } from "@resume/ui/button";
import ReviewCard from "./ReviewCard";
import AddReviewModal from "./AddReviewModal";

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

interface WallOfLoveProps {
  initialReviews: Review[];
}

export default function WallOfLove({ initialReviews }: WallOfLoveProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReviewSubmitted = (newReview: Review) => {
    setReviews(prev => [newReview, ...prev]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-black dark:text-white">Wall of Love</h2>
          <p className="text-gray-600 dark:text-gray-300">
            See what others are saying about our resume builder
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          Share Your Experience
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <AddReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
} 