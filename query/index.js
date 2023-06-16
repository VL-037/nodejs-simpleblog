const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

const handleEvents = (type, data) => {
  switch (type) {
    case "POST_CREATED":
      var { id, title } = data;
      posts[id] = { id, title, comments: [] };
      break;
    case "COMMENT_CREATED":
      var { id, content, status, postId } = data;

      var post = posts[postId];
      post.comments.push({ id, content, status });
      break;
    case "COMMENT_UPDATED":
      var { postId, id, content, status } = data;

      var post = posts[postId];
      var comment = post.comments.find((comment) => comment.id === id);

      comment.content = content;
      comment.status = status;
      break;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvents(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log("Listening on 4002");
  try {
    const res = await axios.get("http://event-srv:4005/events");

    for (let event of res.data) {
      console.log("Processing event:", event.type);

      handleEvents(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
});
