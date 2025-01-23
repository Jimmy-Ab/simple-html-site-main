"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const PORT = 3001;
//API_URL
const API_URL = "https://jsonplaceholder.typicode.com/comments?postId=3";
// In-memory cache to store comments
exports.cache = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
// TODO: update this so it makes a request to https://jsonplaceholder.typicode.com/comments?postId=3
// and it returns a list of comments that match what the user entered
// Bonus: cache results in memory for 5 mins
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const keyword = req.query.keyword;
    if (!keyword) {
        res
            .status(400)
            .json({ error: "Keyword is required as a query parameter." });
        return;
    }
    try {
        // Check if cached data exists and is still valid
        if (exports.cache.comments && Date.now() < exports.cache.comments.expiry) {
            console.log("Serving from cache");
        }
        else {
            console.log("Fetching from API");
            const comments = yield fetchComments();
            exports.cache.comments = {
                data: comments,
                expiry: Date.now() + CACHE_DURATION,
            };
        }
        // Filter comments by the `name` property
        const filteredComments = exports.cache.comments.data.filter((comment) => comment.name.toLowerCase().includes(keyword.toLowerCase()));
        res.status(200).json(filteredComments);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch comments." });
    }
}));
// Function to fetch comments from the API
const fetchComments = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(API_URL);
    if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.statusText}`);
    }
    return response.json(); // Return the array of comments
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
