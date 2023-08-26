import { CloudDownloadOutlined } from "@ant-design/icons";
import { Modal, Image, Button } from 'antd'
import React from 'react'

export default function VisualizationModal({ resource_id, mimetype, open, close }) {
  const getContent = () => {
    switch (mimetype) {
      case "img":
        return <Image src={null} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      title="Visualization"
      open={open}
      onCancel={close}
      footer={[
        <Button onClick={close}>Cancel</Button>,
        <Button icon={<CloudDownloadOutlined />}>Download</Button>,
        <Button type="primary">Ok</Button>,
      ]}
    >
      {mimetype}
    </Modal>
  );
}
