import express, { Request, Response, NextFunction } from "express";
import { SEARCH_PARAM, Dataset } from "./utils/stringSearchEngine";
import searchEngineInstance from "./utils/searchEngineSingletonCon";

function add_post_route(req: Request, res: Response, next: NextFunction): void {
  try {
    const { name, description, dateLastEdited, image } = req.body;
    const new_post: Dataset[] = [
      {
        name,
        image,
        description,
        dateLastEdited,
      },
    ];

    searchEngineInstance.addNew(new_post, [
      SEARCH_PARAM.NAME,
      SEARCH_PARAM.DESCRIPTION,
      SEARCH_PARAM.IMAGE,
    ]);
    res
      .status(200)
      .send({ message: "Post Successfully added.", data: { new_post } });
  } catch (error) {
    // Handle Errors
  }
}

export default add_post_route;
