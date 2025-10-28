// app/api/checkFollow/route.ts

export async function POST(req: Request) {
  try {
    const { userX } = await req.json(); // parse JSON body
    if (!userX) {
      return new Response(JSON.stringify({ error: "userX is required" }), { status: 400 });
    }

    const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
    const myUserId = "3011569766";

    // Step 1: Get userX's ID
    const userRes = await fetch(`https://api.x.com/2/users/by/username/${userX.trim()}`, {
      headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
    });

    if (!userRes.ok) {
      const err = await userRes.json();
      return new Response(JSON.stringify({ error: err }), { status: userRes.status });
    }

    const userData = await userRes.json();
    const userXId = userData.data.id;

    // Step 2: Get userX's following list
    const followingRes = await fetch(`https://api.x.com/2/users/${userXId}/following?max_results=1000`, {
      headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
    });

    if (!followingRes.ok) {
      const err = await followingRes.json();
      return new Response(JSON.stringify({ error: err }), { status: followingRes.status });
    }

    const followingData = await followingRes.json();

    // Step 3: Check if myUserId exists in the following list
    //@ts-ignore
    const isFollowing = followingData.data?.some(user => user.id === myUserId);

    return new Response(JSON.stringify({ isFollowing: !!isFollowing }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
