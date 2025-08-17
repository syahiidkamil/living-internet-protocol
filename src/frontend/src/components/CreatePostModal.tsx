import React, { useState } from "react";

interface Props {
  onSubmit: (title: string, content: string) => Promise<void>;
  onClose: () => void;
}

export const CreatePostModal: React.FC<Props> = ({ onSubmit, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(title, content);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-2xl rounded-lg bg-gray-800">
        <form onSubmit={handleSubmit}>
          <div className="border-b border-gray-700 p-6">
            <h2 className="text-xl font-bold">Create New Post</h2>
          </div>

          <div className="space-y-4 p-6">
            <div>
              <label className="mb-2 block text-sm font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg bg-gray-700 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter post title..."
                maxLength={200}
                required
              />
              <p className="mt-1 text-xs text-gray-400">{title.length}/200</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="h-32 w-full resize-none rounded-lg bg-gray-700 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Share your thoughts..."
                maxLength={5000}
                required
              />
              <p className="mt-1 text-xs text-gray-400">
                {content.length}/5000
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-700 p-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 transition-colors hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
