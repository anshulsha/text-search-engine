import express from "express";
import search_route from "./search.route";
import add_post_route from "./addPost.route";

const router = express.Router();

router.post("/search", search_route);
router.post("/add-post", add_post_route);

export default router;
