import React, { useState, useRef, useEffect } from "react";
import { Space, Button, Typography, Input } from "antd";
import { EDITOR_JS_TOOLS } from "./tools";
import EditorJs from "@natterstefan/react-editor-js";

export default function ArticleEditor() {
  var editor = null;

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

  return (
    <>
      <EditorJs
        placeholder="Starting writing content..."
        holder="custom-editor-container"
        tools={EDITOR_JS_TOOLS}
        defaultBlock="header"
        readOnly={false}
        editorInstance={(editorInstance) => {
          // invoked once the editorInstance is ready
          editor = editorInstance;
        }}
      >
        <div id="custom-editor-container" className="w-full" />
      </EditorJs>

      <Input className="my-5" size="large" placeholder="Reference" />
    </>
  );
}
