import { InboxOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Upload, message } from "antd";

export default function CreateResourceModal({ package_id, open, close }) {
  const props = {
    name: "file",
    multiple: false,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <>
      <Modal
        title="Create new resouce."
        open={open}
        onCancel={close}
        centered={true}
      >
        <Form layout="vertical">
          <Form.Item label="Name">
            <Input placeholder="file name." size="large" />
          </Form.Item>
          <Form.Item label="Description">
            <Input.TextArea
              rows={4}
              placeholder="More details about this file."
            />
          </Form.Item>
          <Form.Item label="File">
            <Upload.Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload.
              </p>
              <p className="ant-upload-hint">
                SConsider zipping large directories for faster uploads.
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
