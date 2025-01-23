import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(cors());
const PORT = 3001;

//API_URL
const API_URL = "https://jsonplaceholder.typicode.com/comments?postId=3";

// In-memory cache to store comments
export const cache: { [key: string]: { data: any; expiry: number } } = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// TODO: update this so it makes a request to https://jsonplaceholder.typicode.com/comments?postId=3
// and it returns a list of comments that match what the user entered
// Bonus: cache results in memory for 5 mins
app.get("/", async (req: Request, res: Response): Promise<void> => {
  const keyword = req.query.keyword as string;

  if (!keyword) {
    res
      .status(400)
      .json({ error: "Keyword is required as a query parameter." });
    return;
  }

  try {
    // Check if cached data exists and is still valid
    if (cache.comments && Date.now() < cache.comments.expiry) {
      console.log("Serving from cache");
    } else {
      console.log("Fetching from API");
      const comments = await fetchComments();

      cache.comments = {
        data: comments,
        expiry: Date.now() + CACHE_DURATION,
      };
    }

    // Filter comments by the `name` property
    const filteredComments = cache.comments.data.filter((comment: any) =>
      comment.name.toLowerCase().includes(keyword.toLowerCase())
    );

    res.status(200).json(filteredComments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments." });
  }
});

// Function to fetch comments from the API
const fetchComments = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch comments: ${response.statusText}`);
  }

  return response.json(); // Return the array of comments
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
