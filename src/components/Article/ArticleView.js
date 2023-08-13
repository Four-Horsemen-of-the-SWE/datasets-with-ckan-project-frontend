import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Space, Button, Typography, Input } from "antd";

export default function ArticleView() {
  const editorRef = useRef(null);

  const logEditorContent = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  const handleFilePicker = (callback, value, meta) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const fileInfo = {
          url: reader.result,
          alt: file.name,
        };
        callback(fileInfo);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <>
      <Typography.Title>Article editor</Typography.Title>
      <Editor
        apiKey={process.env.TINY_MCE_API_KEY}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue="<p>This is the initial content of the editor.</p>"
        init={{
          height: "50vh",
          menubar: false,
          plugins: ["image", "autoresize"],
          toolbar:
            // ... other toolbar options
            "h1 h2 h3 h4 h5 h6 | fontsize | " +
            "undo redo | formatselect | " +
            "bold italic backcolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | image | code ", // Add the 'image' toolbar button
          content_style:
            "@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai&display=swap'); body { font-family: 'Noto Sans Thai', sans-serif; }",
          // Define the file picker callback function
          file_picker_types: "image",
          paste_data_images: true,
          file_picker_callback: handleFilePicker,
        }}
      />

      <Input className="my-5" size="large" placeholder="Reference" />

      <Space className="float-right">
        <Button size="large">Cancel</Button>
        <Button size="large" type="primary" onClick={logEditorContent}>
          Log editor content
        </Button>
      </Space>
    </>
  );
}
