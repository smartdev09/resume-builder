import { NextResponse } from "next/server";

export async function POST(req:any) {
  try {
    const { username } = await req.json();
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const owner = "freeCodeCamp"; // Replace with your GitHub username
    const repo = "freeCodeCamp";        // Replace with your repo name
    const PER_PAGE = 100;

    let page = 1;
    let found = false;

    while (true) {
      const url = `https://api.github.com/repos/${owner}/${repo}/subscribers?per_page=${PER_PAGE}&page=${page}`;
      const response = await fetch(url, {
        headers: {
          "Accept": "application/vnd.github+json",
          "Authorization": `token ${process.env.GITHUB_TOKEN}`,
        },
      });

      const watchers = await response.json();

      if (!Array.isArray(watchers) || watchers.length === 0) break; // no more pages

      // Check if username exists in this page
      found = watchers.some(user => user.login.toLowerCase() === username.toLowerCase());
      if (found) break;

      page++; // move to next page
    }

    return NextResponse.json({ username, isWatcher: found });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
