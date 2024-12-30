import * as ai from "../utils/aiconfig.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getResult = asyncHandler(async (req, res) => {
  const { prompt } = req.query;
  const result = await ai.generatePrompt(prompt);
  res.json({ result });
});
