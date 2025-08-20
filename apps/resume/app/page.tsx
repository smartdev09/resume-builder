import LandingPage from "./components/LandingPage";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from "next/headers";

export default async function Page() {
  const supabase =  createServerComponentClient({ cookies });

  // Fetch initial reviews using environment variables
  const domain = process.env.VERCEL_URL || "localhost:3000";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  
  try {
    const { data, error } = await supabase
          .from("reviews")
          .select("*")
    
    console.log('sadasdas',data)
    if(data)
    return <LandingPage 
  initialReviews={data} 
  />;
   
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    // initialReviews remains empty array
  }

  
}