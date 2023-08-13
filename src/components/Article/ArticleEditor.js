import React from "react";
import { Space, Button, message } from "antd";
import { EDITOR_JS_TOOLS } from "./tools";
import EditorJs from "@natterstefan/react-editor-js";
import { useAuthHeader } from "react-auth-kit";
import axios from "axios";

const defaultContent = {
  time: Date.now(),
  blocks: [
    {
      type: "paragraph",
      data: {
        text: "Your default content goes here.",
      },
    },
  ],
};

export default function ArticleEditor({ content, dataset_id, setIsEditMode }) {
  const authHeader = useAuthHeader();
  var editor = null;

  const handleSave = async() => {
    try {
      const outputData = await editor.save();
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
        window.location.reload();
      }
    } catch(error) {
      console.error(error);
    }
  }

  const handleReady = async () => {
    if(editor) {
      await editor.render(content || defaultContent);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end">
        <Space>
          <Button onClick={() => setIsEditMode(false)}>Cancel</Button>
          <Button type="primary" onClick={handleSave}>Save</Button>
        </Space>
      </div>

      <EditorJs
        placeholder="Starting writing content..."
        holder="custom-editor-container"
        tools={EDITOR_JS_TOOLS}
        defaultBlock="header"
        readOnly={false}
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
