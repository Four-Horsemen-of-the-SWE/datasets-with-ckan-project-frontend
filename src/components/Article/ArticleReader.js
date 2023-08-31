import EditorJs from "@natterstefan/react-editor-js";
import { EDITOR_JS_TOOLS } from "./tools";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { useAuthUser, useIsAuthenticated } from "react-auth-kit";
import { useState, useEffect } from "react";
import ArticleDeleteModal from "./ArticleDeleteModal";

export default function ArticleReader({ article_id, content, setIsEditMode, creator_user_id }) {
  var editor = null;
  const auth = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleReady = async () => {
    if (editor) {
      await editor.render(content);
    }
  };

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

  return (
    <>
      <ArticleDeleteModal
        article_id={article_id}
        open={showDeleteModal}
        close={() => setShowDeleteModal(false)}
      />

      {auth()?.id === creator_user_id && (
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
