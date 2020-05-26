import { Router } from "express";

import { auth } from "../middleware";
import BlogController from "../controllers/blogController";

const router = Router();

router.post("/", auth, BlogController.createBlog);
router.delete("/:blogId", auth, BlogController.deleteBlog);
router.get("/:data", auth, BlogController.getBlogs);

export default router;

