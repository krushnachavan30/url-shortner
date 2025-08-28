const express = require("express");
const shortid = require("shortid");
const URL = require("../models/url");
const router = express.Router();

// Home Page
router.get("/", (req, res) => {
  res.render("index");
});

// Create Short URL
router.post("/shorten", async (req, res) => {
  const body = req.body;
  if (!body.url) return res.status(400).send("URL is required");

  const shortId = shortid.generate();

  await URL.create({
    shortId: shortId,
    redirectUrl: body.url,
    visitHistory: [],
  });

  res.render("result", { shortUrl: `http://localhost:8000/${shortId}` });
});

// Redirect
router.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    }
  );

  if (!entry) return res.status(404).send("URL not found");
  res.redirect(entry.redirectUrl);
});

module.exports = router;
