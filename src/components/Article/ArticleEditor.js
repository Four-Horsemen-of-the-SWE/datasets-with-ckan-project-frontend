import React, { useEffect, useState } from "react";
import { Space, Button, message, Typography } from "antd";
import { EDITOR_JS_TOOLS } from "./tools";
import EditorJs from "@natterstefan/react-editor-js";
import { useAuthHeader } from "react-auth-kit";
import axios from "axios";
import './editor-style.css';

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

export default function ArticleEditor({ content, dataset_id, setIsEditMode }) {
  const authHeader = useAuthHeader();
  var editor = null;
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async() => {
    try {
      setIsSaving(true);
      const outputData = await editor.save();

      if(!outputData.blocks?.length) {
        setIsSaving(false);
        return message.warning("Article is empty")
      }

      const response = await axios.post(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/articles/`,
        {
          package_id: dataset_id,
          content: outputData,
        },
        {
          headers: {
            Authorization: authHeader().split(" ")[1]
          }
        }
      );

      if(response.data.ok) {
        message.success("Article has been saved successfully.");
        setIsSaving(false);
        window.location.reload();
      } else {
        message.warning("Unable to save at this time");
        setIsSaving(false);
      }
    } catch(error) {
      setIsSaving(false);
      console.error(error);
    }
  }

  const handleReady = async () => {
    try {
      if(editor) {
        await editor.render(content || defaultContent);
      }
    } catch(error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end">
        <Space>
          <Button onClick={() => setIsEditMode(false)} disabled={isSaving}>Cancel</Button>
          <Button type="primary" onClick={handleSave} loading={isSaving}>
            Save
          </Button>
        </Space>
      </div>

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
    </>
  );
}
