import { InboxOutlined } from "@ant-design/icons";
import {
  Button,
  message,
  Steps,
  theme,
  Modal,
  Form,
  Input,
  Upload,
} from "antd";
import { useState } from "react";

const { TextArea } = Input;
const { Dragger } = Upload;

const DetailForm = () => {
  return (
    <Form layout="vertical" className="p-4">
      <Form.Item label="Datasets Name" name="dataset_name">
        <Input size="large" placeholder="dataset name" />
      </Form.Item>
      <Form.Item label="Source" name="source">
        <Input size="large" placeholder="reference url" />
      </Form.Item>
      <Form.Item label="Notes" name="notes">
        <TextArea rows={4} placeholder="description" />
      </Form.Item>
    </Form>
  );
};

const UploadForm = () => {
  return (
    <Dragger multiple>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibited from uploading
        company data or other banned files.
      </p>
    </Dragger>
  );
};

const steps = [
  {
    title: "Fill Details",
    content: <DetailForm />,
  },
  {
    title: "Upload Resource File",
    content: <UploadForm />,
  },
];

export default function CreateDatasetsModal({ isModalOpen, close }) {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const contentStyle = {
    lineHeight: "260px",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  return (
    <Modal
      title="Create Datasets"
      open={isModalOpen}
      onOk={close}
      onCancel={close}
      footer={[]}
    >
      <Steps current={current} items={items} />
      <div style={contentStyle}>{steps[current].content}</div>
      <div
        style={{
          marginTop: 24,
        }}
      >
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current > 0 && (
          <Button
            style={{
              margin: "0 8px",
            }}
            onClick={() => prev()}
          >
            Previous
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success("Processing complete!")}
          >
            Create!
          </Button>
        )}
      </div>
    </Modal>
  );
}
