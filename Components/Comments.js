"use client";
import { useEffect, useState } from "react";

function buildTree(comments) {
  const map = {};
  const roots = [];

  comments.forEach((c) => {
    map[c._id] = { ...c, replies: [] };
  });

  comments.forEach((c) => {
    if (c.parentId) {
      if (map[c.parentId]) {
        map[c.parentId].replies.push(map[c._id]);
      }
    } else {
      roots.push(map[c._id]);
    }
  });

  return roots;
}

const CommentItem = ({
  comment,
  openComments,
  setOpenComments,
  replyingTo,
  setReplyingTo,
  replyTexts,
  setReplyTexts,
  postComment,
}) => {
  const isOpen = openComments[comment._id] || false;
  const isReplying = replyingTo[comment._id] || false;
  const replyText = replyTexts[comment._id] || "";

  return (
    <div className="bg-gray-700 p-4 rounded-md mt-2 border border-gray-600 shadow-md transition hover:bg-gray-600">
      {/* Header */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() =>
          setOpenComments((prev) => ({
            ...prev,
            [comment._id]: !prev[comment._id],
          }))
        }
      >
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 font-bold">
            {isOpen ? "▼" : "▶"}
          </span>
          <p className="font-semibold text-white">{comment.author}</p>
        </div>

        <span className="text-gray-400 text-sm">
          {comment.replies.length} replies
        </span>
      </div>

      <p className="mt-2 text-gray-200">{comment.text}</p>

      {/* Reply button */}
      <button
        className="text-sm text-blue-400 mt-2"
        onClick={() =>
          setReplyingTo((prev) => ({
            ...prev,
            [comment._id]: !prev[comment._id],
          }))
        }
      >
        {isReplying ? "Cancel Reply" : "Reply"}
      </button>

      {/* Reply input */}
      {isReplying && (
        <div className="mt-3 ml-6">
          <input
            type="text"
            value={replyText}
            onChange={(e) =>
              setReplyTexts((prev) => ({
                ...prev,
                [comment._id]: e.target.value,
              }))
            }
            placeholder="Write a reply..."
            className="bg-gray-600 p-2 rounded-3xl w-full placeholder-gray-400 text-white"
          />
          <button
            onClick={() => {
              postComment(comment._id, replyText);
              setReplyTexts((prev) => ({ ...prev, [comment._id]: "" }));
              setReplyingTo((prev) => ({ ...prev, [comment._id]: false }));
            }}
            className="bg-green-500 px-4 py-1 rounded-md mt-2 hover:bg-green-600"
          >
            Post Reply
          </button>
        </div>
      )}

      {/* Nested replies */}
      {isOpen && comment.replies.length > 0 && (
        <div className="mt-3 space-y-2 ml-4 border-l-2 border-gray-500 pl-4">
          {comment.replies.map((r) => (
            <CommentItem
              key={r._id}
              comment={r}
              openComments={openComments}
              setOpenComments={setOpenComments}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyTexts={replyTexts}
              setReplyTexts={setReplyTexts}
              postComment={postComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function CommentsPage({ course }) {
  const [author, setAuthor] = useState("");
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  const [openComments, setOpenComments] = useState({}); // track multiple expanded
  const [replyingTo, setReplyingTo] = useState({}); // track multiple reply boxes
  const [replyTexts, setReplyTexts] = useState({});

  const fetchComments = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/Comments?courseId=${course._id}`
      );
      const data = await res.json();
      setComments(buildTree(data.comments || []));
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const postComment = async (parentId = null, textOverride = null) => {
    const textToSend = parentId ? textOverride : newComment;
    if (!author || !textToSend) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API}/api/Comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToSend,
          author,
          parentId,
          courseId: course._id,
        }),
      });

      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  return (
    <div className="bg-gray-800 my-6 rounded-2xl p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Comments</h1>

      {/* Top-level comment */}
      <div className="flex justify-center mb-6 space-x-2">
        <div className="flex flex-col items-center justify-center my-4">
          <input
            type="text"
            placeholder="Your Name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="p-2 lg:w-[90vw] w-[20rem] rounded-md my-3 bg-gray-700 text-white placeholder-gray-400"
          />
          <textarea
            rows={5}
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="p-2 lg:w-[90vw] w-[20rem] rounded-md bg-gray-700 text-white placeholder-gray-400"
          />
          <button
            onClick={() => postComment()}
            className="bg-purple-500 px-4 py-2 my-4 rounded-md hover:bg-purple-600"
          >
            Post
          </button>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((c) => (
            <CommentItem
              key={c._id}
              comment={c}
              openComments={openComments}
              setOpenComments={setOpenComments}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyTexts={replyTexts}
              setReplyTexts={setReplyTexts}
              postComment={postComment}
            />
          ))
        ) : (
          <p className="text-gray-400">No comments yet.</p>
        )}
      </div>
    </div>
  );
}
