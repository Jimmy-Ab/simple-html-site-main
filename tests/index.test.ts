import request from "supertest";
import fetch, { Response } from "node-fetch";
import app, { cache } from "../node/index";

jest.mock("node-fetch", () => {
  const actualFetch = jest.requireActual("node-fetch");
  return {
    __esModule: true,
    ...actualFetch,
    default: jest.fn(),
  };
});

const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("GET /", () => {
  beforeEach(() => {
    jest.resetModules(); // Clear module cache
    jest.clearAllMocks(); // Clear mock calls
  });

  it("should return filtered comments based on keyword", async () => {
    const mockApiResponse = [{ name: "test comment 1" }, { name: "another test comment" }];

    mockedFetch.mockResolvedValueOnce(
      new Response(JSON.stringify(mockApiResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    console.log(mockedFetch.mock.calls); // Debug the mock calls

    const response = await request(app).get("/").query({ keyword: "test" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockApiResponse);
    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(mockedFetch).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/comments?postId=3",
      undefined
    );
  });

  it("should return an empty array if no matching comments are found", async () => {
    const mockApiResponse = [{ name: "unrelated comment" }, { name: "random text" }];

    mockedFetch.mockResolvedValueOnce(
      new Response(JSON.stringify(mockApiResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await request(app).get("/").query({ keyword: "nonexistent" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should return a 500 error if the API request fails", async () => {
    mockedFetch.mockRejectedValueOnce(new Error("API request failed"));

    const response = await request(app).get("/").query({ keyword: "test" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Failed to fetch comments." });
  });

  it("should return a 400 error if keyword is missing", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Keyword is required as a query parameter.",
    });
  });

  it("should serve cached data when available", async () => {
    const mockApiResponse = [{ name: "cached comment" }];

    cache.comments = {
      data: mockApiResponse,
      expiry: Date.now() + 5 * 60 * 1000, // Cache still valid
    };

    const response = await request(app).get("/").query({ keyword: "cached" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockApiResponse);
    expect(mockedFetch).not.toHaveBeenCalled();
  });
});
