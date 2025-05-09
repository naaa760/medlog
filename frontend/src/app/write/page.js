"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

export default function WritePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState([
    { id: uuidv4(), type: "text", content: "" },
  ]);
  const [isDraft, setIsDraft] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [mediaMenuPosition, setMediaMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);
  const blockRefs = useRef({});
  const titleRef = useRef(null);
  const userMenuRef = useRef(null);
  const fileInputRef = useRef(null);
  const [editingArticleId, setEditingArticleId] = useState(null);

  // Auto-resize the content textarea as user types
  useEffect(() => {
    Object.values(blockRefs.current).forEach((ref) => {
      if (ref && ref.tagName === "TEXTAREA") {
        ref.style.height = "auto";
        ref.style.height = ref.scrollHeight + "px";
      }
    });
  }, [blocks]);

  // Handle clicks outside menus
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }

      // Close media menu when clicking outside
      if (
        !event.target.closest(".media-menu") &&
        !event.target.closest(".media-button")
      ) {
        setShowMediaMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  // Auto-save draft
  useEffect(() => {
    const saveDraft = setTimeout(() => {
      if ((title || blocks.some((block) => block.content)) && isDraft) {
        console.log("Auto-saving draft...");

        // Save draft to localStorage
        if (title || blocks.some((block) => block.content)) {
          const draft = {
            title,
            blocks,
            lastUpdated: new Date().toISOString(),
          };
          localStorage.setItem("medium-draft", JSON.stringify(draft));
        }
      }
    }, 3000);

    return () => clearTimeout(saveDraft);
  }, [title, blocks, isDraft]);

  // Load draft on initial load
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem("medium-draft");
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (!title && parsed.title) setTitle(parsed.title);
        if (parsed.blocks && parsed.blocks.length > 0) {
          setBlocks(parsed.blocks);
        }
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    }
  }, []);

  // Check for edit parameter in URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const editId = params.get("edit");

      if (editId) {
        try {
          const savedArticles = JSON.parse(
            localStorage.getItem("medium-published-articles") || "[]"
          );
          const articleToEdit = savedArticles.find(
            (article) => article.id.toString() === editId
          );

          if (articleToEdit) {
            setTitle(articleToEdit.title || "");

            if (articleToEdit.blocks && articleToEdit.blocks.length > 0) {
              setBlocks(articleToEdit.blocks);
            } else if (articleToEdit.content) {
              // Handle legacy format
              setBlocks([
                { id: uuidv4(), type: "text", content: articleToEdit.content },
              ]);
            }

            setEditingArticleId(parseInt(editId));
          }
        } catch (error) {
          console.error("Error loading article for editing:", error);
        }
      }
    }
  }, []);

  const handleTitleKeyDown = (e) => {
    // When Enter is pressed in the title field, move to first content block
    if (e.key === "Enter") {
      e.preventDefault();
      if (blockRefs.current[blocks[0].id]) {
        blockRefs.current[blocks[0].id].focus();
      }
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Show media options at the current block
  const showMediaOptions = (blockIndex) => {
    setActiveBlockIndex(blockIndex);
    const blockId = blocks[blockIndex].id;
    const blockElement = blockRefs.current[blockId];

    if (!blockElement) return;

    const rect = blockElement.getBoundingClientRect();
    setMediaMenuPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX - 50,
    });

    setShowMediaMenu(true);
  };

  const handleBlockContentChange = (index, value) => {
    const newBlocks = [...blocks];
    newBlocks[index].content = value;
    setBlocks(newBlocks);
  };

  const handleBlockKeyDown = (e, index) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      // Create a new text block below the current one
      const newBlock = { id: uuidv4(), type: "text", content: "" };
      const updatedBlocks = [...blocks];
      updatedBlocks.splice(index + 1, 0, newBlock);
      setBlocks(updatedBlocks);

      // Focus will be set in useEffect after rendering
      setTimeout(() => {
        if (blockRefs.current[newBlock.id]) {
          blockRefs.current[newBlock.id].focus();
        }
      }, 0);
    }
  };

  // Handle file upload with image optimization
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size before processing
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      alert("Image is too large. Please select an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      // Optimize image before inserting
      const img = new Image();
      img.onload = () => {
        // Create canvas to resize the image
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        // Set canvas dimensions and draw resized image
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Get optimized image data with reduced quality
        const optimizedImageData = canvas.toDataURL("image/jpeg", 0.7);
        insertMedia("image", optimizedImageData);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Insert media after the active block
  const insertMedia = (type, content = null) => {
    const newBlocks = [...blocks];

    switch (type) {
      case "image":
        if (!content) {
          // Trigger file input click to select an image
          fileInputRef.current?.click();
          return;
        }

        // Insert a new image block after the active block
        const newImageBlock = {
          id: uuidv4(),
          type: "image",
          content: content,
        };

        newBlocks.splice(activeBlockIndex + 1, 0, newImageBlock);

        // Add an empty text block after the image if there isn't already one
        if (
          activeBlockIndex + 2 >= newBlocks.length ||
          newBlocks[activeBlockIndex + 2].type !== "text"
        ) {
          newBlocks.splice(activeBlockIndex + 2, 0, {
            id: uuidv4(),
            type: "text",
            content: "",
          });
        }

        setBlocks(newBlocks);
        setShowMediaMenu(false);

        // Focus on the text block after the image
        setTimeout(() => {
          const nextTextBlock = newBlocks[activeBlockIndex + 2];
          if (nextTextBlock && blockRefs.current[nextTextBlock.id]) {
            blockRefs.current[nextTextBlock.id].focus();
          }
        }, 0);
        break;

      case "video":
        const videoUrl = prompt(
          "Enter YouTube or Vimeo URL:",
          "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        );
        if (!videoUrl) return;

        newBlocks.splice(activeBlockIndex + 1, 0, {
          id: uuidv4(),
          type: "video",
          content: videoUrl,
        });

        // Add an empty text block after the video
        if (
          activeBlockIndex + 2 >= newBlocks.length ||
          newBlocks[activeBlockIndex + 2].type !== "text"
        ) {
          newBlocks.splice(activeBlockIndex + 2, 0, {
            id: uuidv4(),
            type: "text",
            content: "",
          });
        }

        setBlocks(newBlocks);
        setShowMediaMenu(false);
        break;

      case "embed":
        const embedCode = prompt(
          "Enter embed code or URL:",
          "<iframe src='https://example.com'></iframe>"
        );
        if (!embedCode) return;

        newBlocks.splice(activeBlockIndex + 1, 0, {
          id: uuidv4(),
          type: "embed",
          content: embedCode,
        });

        // Add an empty text block after the embed
        if (
          activeBlockIndex + 2 >= newBlocks.length ||
          newBlocks[activeBlockIndex + 2].type !== "text"
        ) {
          newBlocks.splice(activeBlockIndex + 2, 0, {
            id: uuidv4(),
            type: "text",
            content: "",
          });
        }

        setBlocks(newBlocks);
        setShowMediaMenu(false);
        break;
    }
  };

  const publishArticle = async () => {
    if (!title.trim()) {
      alert("Please add a title to your article");
      return;
    }

    if (blocks.length === 0 || blocks.every((block) => !block.content.trim())) {
      alert("Please add some content to your article");
      return;
    }

    try {
      setIsSaving(true);

      // Extract topics from content - look for hashtags or determine category
      const contentText = blocks.map((b) => b.content).join(" ");
      const detectedTopics = detectTopicsFromContent(contentText);

      // Prompt user to add topics if none detected
      const finalTopics =
        detectedTopics.length > 0
          ? detectedTopics
          : [
              prompt(
                "Add at least one topic for your article (e.g., Programming, Technology):",
                "Technology"
              ),
            ];

      const newArticle = {
        id: Date.now(),
        title,
        content: blocks.map((b) => b.content).join("\n\n"),
        excerpt: blocks[0].content.substring(0, 150) + "...",
        readTime: `${Math.max(
          1,
          Math.ceil(
            blocks.reduce((acc, block) => acc + block.content.length, 0) / 1000
          )
        )} min read`,
        author: {
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
        },
        createdAt: new Date().toISOString(),
        claps: 0,
        topics: finalTopics, // Add topics to the article
        image: "https://picsum.photos/seed/" + Date.now() + "/400/268",
      };

      // Get existing articles
      const savedArticles = JSON.parse(
        localStorage.getItem("medium-published-articles") || "[]"
      );

      // Add new article to the beginning
      savedArticles.unshift(newArticle);

      // Save back to localStorage
      localStorage.setItem(
        "medium-published-articles",
        JSON.stringify(savedArticles)
      );

      // Broadcast new article via custom event (simulating WebSocket)
      window.dispatchEvent(
        new CustomEvent("new-article-published", {
          detail: { article: newArticle },
        })
      );

      router.push(`/article/${newArticle.id}`);
    } catch (error) {
      console.error("Error publishing article:", error);
      alert("Failed to publish your article. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to detect topics from content
  const detectTopicsFromContent = (content) => {
    const commonTopics = [
      "Programming",
      "JavaScript",
      "React",
      "Next.js",
      "Web Development",
      "Technology",
      "AI",
      "Machine Learning",
      "Data Science",
      "Productivity",
      "Self Improvement",
      "Writing",
    ];

    const topics = [];

    // Look for hashtags
    const hashtags = content.match(/#(\w+)/g);
    if (hashtags) {
      hashtags.forEach((tag) => {
        topics.push(tag.substring(1)); // Remove the # symbol
      });
    }

    // Check for common topics in content
    commonTopics.forEach((topic) => {
      if (
        content.toLowerCase().includes(topic.toLowerCase()) &&
        !topics.includes(topic)
      ) {
        topics.push(topic);
      }
    });

    // Limit to 3 topics max
    return topics.slice(0, 3);
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hidden file input for image uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="max-w-[1192px] w-full mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="font-serif text-lg md:text-xl font-bold">
              Medium
            </Link>
            {isDraft && (
              <div className="ml-4 text-sm text-gray-500">
                Draft in {user?.firstName || user?.username || "untitled"}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={publishArticle}
              disabled={
                isSaving || !title || !blocks.some((block) => block.content)
              }
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                isSaving || !title || !blocks.some((block) => block.content)
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {isSaving ? "Publishing..." : "Publish"}
            </button>

            <button className="text-gray-600 hover:text-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-more-horizontal"
              >
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>

            <div className="relative">
              <div
                className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
                onClick={toggleUserMenu}
                ref={userMenuRef}
              >
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
                    {user?.firstName?.[0] || user?.username?.[0] || "U"}
                  </div>
                )}
              </div>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        {user?.imageUrl ? (
                          <img
                            src={user.imageUrl}
                            alt="Profile"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
                            {user?.firstName?.[0] || user?.username?.[0] || "U"}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {user?.firstName || user?.username || "User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          @{user?.username || "username"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/write"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Write
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Library
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Stories
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Stats
                    </Link>
                  </div>

                  <div className="border-t border-gray-200 py-1">
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Settings
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Refine recommendations
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Manage publications
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Help
                    </Link>
                  </div>

                  <div className="border-t border-gray-200 py-1">
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Apply to the Partner Program
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Become a member
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="flex-1 max-w-[800px] w-full mx-auto px-4 py-8 bg-white">
        <div className="mb-8">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            placeholder="Title"
            className="w-full text-3xl md:text-4xl lg:text-5xl font-serif text-gray-800 focus:text-gray-800 outline-none placeholder-gray-300 font-normal"
            autoFocus
          />
        </div>

        <div className="relative editor-container">
          {/* Block-based content */}
          {blocks.map((block, index) => (
            <div key={block.id} className="relative mb-4">
              {block.type === "text" && (
                <>
                  {/* Plus button next to empty text blocks */}
                  {!block.content && (
                    <button
                      className="media-button absolute -left-10 w-8 h-8 text-gray-400 hover:text-gray-600 cursor-pointer transition-opacity"
                      onClick={() => showMediaOptions(index)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                      </svg>
                    </button>
                  )}
                  <textarea
                    ref={(el) => (blockRefs.current[block.id] = el)}
                    value={block.content}
                    onChange={(e) =>
                      handleBlockContentChange(index, e.target.value)
                    }
                    onKeyDown={(e) => handleBlockKeyDown(e, index)}
                    placeholder={index === 0 ? "Tell your story..." : ""}
                    className="w-full text-lg md:text-xl text-gray-700 outline-none resize-none placeholder-gray-400"
                    style={{ overflow: "hidden" }}
                  />
                </>
              )}

              {block.type === "image" && (
                <div className="my-6 relative">
                  <img
                    src={block.content}
                    alt="User uploaded"
                    className="max-w-full rounded"
                  />
                </div>
              )}

              {block.type === "video" && (
                <div className="my-6">
                  <div className="relative pt-[56.25%] bg-gray-100">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      Video: {block.content}
                    </div>
                  </div>
                </div>
              )}

              {block.type === "embed" && (
                <div className="my-6">
                  <div className="relative pt-[56.25%] bg-gray-100">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      Embed: {block.content}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Media menu */}
          {showMediaMenu && (
            <div
              className="media-menu absolute bg-white shadow-lg rounded-lg z-20 w-40"
              style={{
                top: mediaMenuPosition.top + "px",
                left: mediaMenuPosition.left + "px",
              }}
            >
              <div className="py-1">
                <button
                  onClick={() => insertMedia("image")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Image
                </button>
                <button
                  onClick={() => insertMedia("video")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Video
                </button>
                <button
                  onClick={() => insertMedia("embed")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  Embed
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
