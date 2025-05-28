import { Card } from "@resume/ui/card";
import Image from "next/image";
import { Star, Twitter, Linkedin, User } from "lucide-react";

interface ReviewCardProps {
  review: {
    id: string;
    text: string;
    rating: number;
    displayName?: string | null;
    pictureUrl?: string | null;
    twitterHandle?: string | null;
    linkedinUrl?: string | null;
    createdAt: Date;
  };
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {review.pictureUrl ? (
              <img
                src={review.pictureUrl}
                alt={review.displayName || "Reviewer"}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-black dark:text-white">
              {review.displayName || "Anonymous"}
            </p>
            <div className="flex">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            {review.twitterHandle && (
              <a
                href={`https://twitter.com/${review.twitterHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {review.linkedinUrl && (
              <a
                href={review.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 flex-1 whitespace-pre-wrap">
          {review.text}
        </p>
        
        <time className="mt-4 text-sm text-gray-400">
          {new Date(review.createdAt).toLocaleDateString()}
        </time>
      </div>
    </Card>
  );
} 