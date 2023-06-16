const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { content } = req.body;
  const status = "PENDING";

  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id, content, status });

  commentsByPostId[req.params.id] = comments;

  await axios.post("http://event-srv:4005/events", {
    type: "COMMENT_CREATED",
    data: {
      id,
      content,
      status,
      postId: req.params.id,
    },
  });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  console.log("Received Event: ", req.body.type);

  const { type, data } = req.body;

  if (type === "COMMENT_MODERATED") {
    const { postId, id, status, content } = data;

    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);

    comment.status = status;

    await axios.post("http://event-srv:4005/events", {
      type: "COMMENT_UPDATED",
      data: {
        postId,
        id,
        status,
        content,
      },
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
