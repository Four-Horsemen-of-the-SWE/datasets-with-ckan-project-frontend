import EditorJs from "@natterstefan/react-editor-js";

export default function ArticleRead() {
  var editor = null;
  return (
    <>
      <EditorJs
        placeholder="Starting writing content..."
        holder="custom-editor-container"
        readOnly={true}
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
