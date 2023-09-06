import React, { useEffect, useState } from "react";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { Space, Button, message, Typography, Input, Upload } from "antd";
import { EDITOR_JS_TOOLS } from "./tools";
import EditorJs from "@natterstefan/react-editor-js";
import { useAuthHeader } from "react-auth-kit";
import axios from "axios";
import "./editor-style.css";
// import "./uploadbutton.css"

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

export default function ArticleCreate({ dataset_id, cancel }) {
  const authHeader = useAuthHeader();
  var editor = null;
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: authHeader()?.split(" ")[1],
    },
  };

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
    setIsCreating(true);
    if(title === "") {
      setIsCreating(false);
      return message.warning("Please enter title of article")
    }
    try {
      const outputData = await editor.save();
      if (!outputData.blocks?.length) {
        setIsCreating(false);
        return message.warning("Article is empty");
      }

      let formData = new FormData();
      formData.append('title', title)
      formData.append("content", JSON.stringify(outputData));
      formData.append('package_id', dataset_id)
      formData.append('thumbnail', thumbnail);

      const response = await axios.post(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/articles/`,
        formData,
        config
      );

      if(response.data.ok) {
        message.success("create article success")
        setTimeout(() => {
          window.location.reload();
        }, 400);
      } else {
        message.error("create failed")
      }
      setIsCreating(false);
    } catch(error) {
      setIsCreating(false);
      console.error(error);
      message.error("create failed")
    }
  }

  return (
    <>
      <Typography.Title>Create article</Typography.Title>
      {/* title */}
      <div className="flex items-end justify-between gap-2 mb-5 w-full">
        <Space direction="vertical" className="w-full">
          <label className="font-semibold text-xl">article title</label>
          <Input
            size="large"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Space>

        <Space direction="vertical">
          <label className="font-semibold text-xl">article thumbnail</label>
          <input
            id="file-upload"
            type="file"
            name="thumbnail"
            accept="image/png, image/jpeg"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="block w-full text-sm file:bg-black file:mr-4 file:rounded-md file:border-0 file:bg-primary-500 file:py-2.5 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-700 focus:outline-none"
          />
        </Space>
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

