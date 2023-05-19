import express, { Request, Response, NextFunction } from "express";
import { Post, PaginationResult } from "./utils/stringSearchEngine";
import searchEngineInstance from "./utils/searchEngineSingletonCon";

function search_route(req: Request, res: Response, next: NextFunction): void {
  try {
    const { searchTerm, pageNumber, pageSize, sortField } = req.body;

    const arr: PaginationResult<Post> = searchEngineInstance.search(
      searchTerm,
      pageNumber || 1,
      pageSize || 10,
      sortField || "name"
    );

    res.status(200).send(arr);
  } catch (error) {
    // Handle Errors
  }
}

export default search_route;
// loadtest -n 1000 -c 1000000 -k -P '{"searchTerm": "the king"}' http://localhost:8000/api/v1/search
