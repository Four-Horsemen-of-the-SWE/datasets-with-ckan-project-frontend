import EditorJs from "@natterstefan/react-editor-js";
import { EDITOR_JS_TOOLS } from "./tools";
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Space, Spin, Typography, message } from "antd";
import { useAuthHeader, useAuthUser, useIsAuthenticated } from "react-auth-kit";
import { useState, useEffect } from "react";
import axios from "axios";
import ArticleEditor from "./ArticleEditor";
import ArticleDeleteModal from "./ArticleDeleteModal";

const defaultContent = {
  time: Date.now(),
  blocks: [
    {
      type: "paragraph",
      data: {
        text: "Your content goes here.",
      },
    },
  ],
};

export default function ArticleReader({ article_id, close }) {
  var editor = null;
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();
  const [article, setArticle] = useState(defaultContent);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const config = {
    headers: {
      Authorization: authHeader()?.split(" ")[1],
    },
  };

  const handleReady = async () => {
    if (editor) {
      await editor.render(article?.content || defaultContent);
    }
  };

  const fetchArticle = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/articles/${article_id}`
      );
      if(response.data.ok) {
        setArticle(response.data.result);
      } else {
        message.error("failed to fetch article")
      }
      setIsLoading(false);
    } catch(error) {
      setIsLoading(false);
      console.error(error);
      message.error("cannot fetch article")
    }
  }

  // fetch an artcle
  useEffect(() => {
    fetchArticle();
  }, []);

  // prevent user can do somethin. i forgot
  useEffect(() => {
    // Prevent drag event on images
    const handleDragStart = (event) => {
      const target = event.target;

      // Check if the dragged element is an image
      if (target.tagName === "IMG") {
        event.preventDefault();
      }
    };

    document.addEventListener("dragstart", handleDragStart);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  if(isLoading) {
    return <Spin size="large" />
  }

  if(isEditMode) {
    return <ArticleEditor old_title={article.title} content={article?.content} cancel={() => setIsEditMode(false)} />
  }

  return (
    <>
      <ArticleDeleteModal article_id={article.id} open={showDeleteModal} close={() => setShowDeleteModal(false)} />

      <Button type="dashed" size="large" icon={<ArrowLeftOutlined />} onClick={close}>Back to all articles</Button>

      {auth()?.id === article.user_id && (
        <div className="flex items-center justify-end">
          <Space>
            <Button icon={<EditOutlined />} onClick={() => setIsEditMode(true)}>
              Edit Article
            </Button>
            <Button
              icon={<DeleteOutlined />}
              type="primary"
              danger={true}
              onClick={() => setShowDeleteModal(true)}
            />
          </Space>
        </div>
      )}

      <Typography.Title>{article?.title}</Typography.Title>
      
      <EditorJs
        tools={EDITOR_JS_TOOLS}
        placeholder="Starting writing content..."
        holder="custom-editor-container"
        readOnly={true}
        editorInstance={(editorInstance) => {
          // invoked once the editorInstance is ready
          editor = editorInstance;
        }}
        onReady={handleReady}
        minHeight={0}
      >
        <div id="custom-editor-container" className="w-full" />
      </EditorJs>
    </>
  );
}
