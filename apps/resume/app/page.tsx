import LandingPage from "./components/LandingPage";
import { headers } from "next/headers";

export default async function Page() {
  // Fetch initial reviews using environment variables
  const domain = process.env.VERCEL_URL || "localhost:3000";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  let initialReviews = [];
  
  try {
    const reviewsResponse = await fetch(`${protocol}://${domain}/api/reviews`, {
      cache: 'no-store'
    });
    
    if (reviewsResponse.ok) {
      initialReviews = await reviewsResponse.json();
    }
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    // initialReviews remains empty array
  }

  return <LandingPage initialReviews={initialReviews} />;
}