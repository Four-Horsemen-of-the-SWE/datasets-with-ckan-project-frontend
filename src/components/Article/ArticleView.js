import React, { useState, useRef, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Space, Button, Typography, Input, Empty } from "antd";
import { EDITOR_JS_TOOLS } from "./tools";
import EditorJs from "@natterstefan/react-editor-js";
import ArticleEditor from "./ArticleEditor";
import ArticleRead from "./ArticleRead";

export default function ArticleView() {
  var editor = null;
  const [isEditMode, setIsEditMode] = useState(true);

  const onReady = () => {
    // https://editorjs.io/configuration#editor-modifications-callback
    console.log("Editor.js is ready to work!");
  };

  const onChange = () => {
    // https://editorjs.io/configuration#editor-modifications-callback
    console.log("Now I know that Editor's content changed!");
  };

  const onSave = async () => {
    // https://editorjs.io/saving-data
    try {
      const outputData = await editor.save();
      console.log("Article data: ", outputData);
    } catch (e) {
      console.log("Saving failed: ", e);
    }
  };

  const handleLoad = async () => {
    await editor.render({});
  };

  // if article not created yet.
  if(false) {
    return (
      <Empty description="No Article">
        <Button type="primary" icon={<PlusOutlined />}>
          Create Article
        </Button>
      </Empty>
    );
  }

  return (
    <>
      {/* edit mode */}
      <div className="flex items-center justify-end">
        {isEditMode ? (
          <Space>
            <Button onClick={() => setIsEditMode(false)}>Cancel</Button>
            <Button type="primary">Save</Button>
          </Space>
        ) : (
          <Button onClick={() => setIsEditMode(true)}>Edit</Button>
        )}
      </div>
      {isEditMode ? <ArticleEditor /> : <ArticleRead />}
    </>
  );
}
