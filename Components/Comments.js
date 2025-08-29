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
}) => {
  const isOpen = activeReply === comment._id; // check if replies are visible

  return (
    <div className="bg-gray-700 p-4 rounded-md mt-2 border border-gray-600 shadow-md transition hover:bg-gray-600">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() =>
          setActiveReply((prev) => (prev === comment._id ? null : comment._id))
        }
      >
        <div className="flex items-center gap-2">
          {/* Symbol for open/closed */}
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

      {/* Reply input shown only if this parent is active */}
      {isOpen && (
        <div className="mt-3 ml-6">
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
            className="bg-green-500 px-4 py-1 rounded-md mt-2 hover:bg-green-600"
          >
            Post Reply
          </button>

          {/* Render replies */}
          {comment.replies.length > 0 && (
            <div className="mt-3 space-y-2 ml-4 border-l-2 border-gray-500 pl-4">
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
      )}
    </div>
  );
};

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
    <div className="bg-gray-800 my-6 rounded-2xl p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Comments</h1>

      {/* Add new top-level comment */}
      <div className="flex  justify-center mb-6 space-x-2">
        <div className="flex flex-col items-center justify-center my-4">
          <input
            type="text"
            placeholder="Your Name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className=" p-2 lg:w-[90vw] w-[20rem] rounded-md my-3 bg-gray-700 text-white placeholder-gray-400"
          />
          <textarea
            rows={8}
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className=" p-2 lg:w-[90vw] w-[20rem] rounded-md bg-gray-700  text-white placeholder-gray-400"
          />
          <button
            onClick={() => postComment()}
            className="bg-purple-500 px-4 py-2 my-4 rounded-md hover:bg-purple-600"
          >
            Post
          </button>
        </div>
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
