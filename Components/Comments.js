"use client";
import { useEffect, useState } from "react";

/**
 * Build nested comments tree from flat comments
 */
// function buildTree(comments, parentId = null) {
//   return comments
//     .filter((c) => String(c.parentId) === String(parentId))
//     .map((c) => ({ ...c, replies: buildTree(comments, c._id) }));
// }

function buildTree(comments) {
  const map = {}; //all the Comments which are not top level
  const roots = []; //All the comments whcih have parent ID null
  comments.forEach((c) => {
    map[c._id] = { ...c, replies: [] }; //this loop creates a map of all Comments and set replies empty array
  });

  comments.forEach((c) => {
    //This loop loop over Each Comment  and checks if c have its parentID then check in map object with that parentId if true then push it into that map key replies of that c._id

    if (c.parentId) {
      if (map[c.parentId]) {
        map[c.parentId].replies.push(map[c._id]);
      }
    } else {
      roots.push(map[c._id]); //IF No parent is present then its a root COmment so puhs into Roots
    }
  });
  return roots;
}

/**
 * Recursive component to render a comment and its replies
 */
const CommentItem = ({
  comment,
  activeReply,
  setActiveReply,
  replyText,
  setReplyText,
  postComment,
}) => (
  <div className="bg-gray-700 p-4 rounded-md mt-2">
    <p className="font-semibold">{comment.author}</p>
    <p>{comment.text}</p>

    <button
      onClick={() =>
        setActiveReply((prev) => (prev === comment._id ? null : comment._id))
      }
      className="text-red-400 my-2"
    >
      Reply →
    </button>

    {activeReply === comment._id && (
      <div className="mt-2">
        <input
          type="text"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write a reply..."
          className="bg-gray-600 p-2 rounded-3xl w-full placeholder-gray-400 text-white"
        />
        <button
          onClick={() => {
            postComment(comment._id);
            setReplyText("");
          }}
          className="bg-green-500 px-3 py-1 rounded-md mt-2"
        >
          Post Reply
        </button>
      </div>
    )}

    {comment.replies.length > 0 && (
      <div className="ml-6 mt-2 space-y-2">
        {comment.replies.map((r) => (
          <CommentItem
            key={r._id}
            comment={r}
            activeReply={activeReply}
            setActiveReply={setActiveReply}
            replyText={replyText}
            setReplyText={setReplyText}
            postComment={postComment}
          />
        ))}
      </div>
    )}
  </div>
);

export default function CommentsPage({ course }) {
  const [author, setAuthor] = useState("");
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [activeReply, setActiveReply] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Fetch comments from API
  const fetchComments = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/Comments?courseId=${course._id}`
    );
    const data = await res.json();
    const tree = buildTree(data.comments || []);
    setComments(tree);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Post a comment or reply
  const postComment = async (parentId = null) => {
    if (!author || (!newComment && !replyText)) return;

    const textToSend = parentId ? replyText : newComment;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/Comments`, {
      method: "POST",
      body: JSON.stringify({
        text: textToSend,
        author,
        parentId,
        courseId: course._id,
      }),
    });
    const data = await res.json();
    console.log(data);

    setNewComment("");
    setReplyText("");
    setActiveReply(null);
    fetchComments();
  };

  return (
    <div className="bg-gray-800 min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Comments</h1>

      {/* Add new top-level comment */}
      <div className="flex mb-6 space-x-2">
        <input
          type="text"
          placeholder="Your Name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="flex-1 p-2 rounded-md bg-gray-700 border-2 border-red-500 text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-2 p-2 rounded-md bg-gray-700 border-2 border-red-500 text-white placeholder-gray-400"
        />
        <button
          onClick={() => postComment()}
          className="bg-purple-500 px-4 py-2 rounded-md hover:bg-purple-600"
        >
          Post
        </button>
      </div>

      {/* Render nested comments */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((c) => (
            <CommentItem
              key={c._id}
              comment={c}
              activeReply={activeReply}
              setActiveReply={setActiveReply}
              replyText={replyText}
              setReplyText={setReplyText}
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
