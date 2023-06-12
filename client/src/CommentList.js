import React from "react";

const CommentList = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    let content = comment.content;

    switch (comment.status) {
      case "PENDING":
        content = "THIS COMMENT IS AWAITING MODERATION";
        break;
      case "REJECTED":
        content = "THIS COMMENT IS BLOCKED";
        break;
    }

    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
