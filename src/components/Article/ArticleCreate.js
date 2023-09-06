import React, { useEffect, useState } from "react";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { Space, Button, message, Typography, Input, Upload } from "antd";
import { EDITOR_JS_TOOLS } from "./tools";
import EditorJs from "@natterstefan/react-editor-js";
import { useAuthHeader } from "react-auth-kit";
import axios from "axios";
import "./editor-style.css";

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

export default function ArticleCreate({ cancel }) {
  const authHeader = useAuthHeader();
  var editor = null;
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const config = {
    headers: {
      Authorization: authHeader()?.split(" ")[1]
    }
  }

  const handleReady = async () => {
    try {
      if (editor) {
        await editor.render(defaultContent);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = async() => {
    if(title === "") {
      return message.warning("Please enter title of article")
    }
    try {
      const payload = null;

      const response = await axios.post(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/articles`,
        payload,
        config
      )
    } catch(error) {
      console.error(error);
      message.error("create failed")
    }
  }

  return (
    <>
      <Typography.Title>Create article</Typography.Title>
      {/* title */}
      <div className="flex items-end justify-between gap-2 mb-5">
        <Space direction="vertical" className="w-full">
          <label className="font-semibold text-xl">article title</label>
          <Input
            size="large"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Space>
        <Upload accept="image/*" maxCount={1} multiple={false}>
          <Button size="large" type="primary" icon={<UploadOutlined />}>
            Upload thumbnail
          </Button>
        </Upload>
      </div>

      {/* content */}
      <Space direction="vertical" className="w-full">
        <label className="font-semibold text-xl">Content</label>
        <EditorJs
          placeholder="Starting writing content..."
          holder="custom-editor-container"
          tools={EDITOR_JS_TOOLS}
          defaultBlock="header"
          onReady={handleReady}
          editorInstance={(editorInstance) => {
            // invoked once the editorInstance is ready
            editor = editorInstance;
          }}
        >
          <div id="custom-editor-container" className="w-full" />
        </EditorJs>
      </Space>

      {/* create button */}
      <Space className="float-right mb-5">
        <Button size="large" onClick={cancel}>
          Cancel
        </Button>
        <Button
          size="large"
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          Create Article
        </Button>
      </Space>
    </>
  );
}
