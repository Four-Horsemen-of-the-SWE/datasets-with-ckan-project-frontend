import { CloudDownloadOutlined } from "@ant-design/icons";
import { Modal, Image, Button } from 'antd'
import React, { useState, useEffect } from 'react'
import { getVisualize } from "../../lib/getVisualization";


export default function VisualizationModal({ resource_id, mimetype, format, url, open, close }) {
  const content = getVisualize(mimetype, url);

  return (
    <Modal
      title="Visualization window"
      open={open}
      onCancel={close}
      maskClosable={false}
      footer={[
        <Button onClick={close}>Cancel</Button>,
        <Button icon={<CloudDownloadOutlined />}>Download</Button>,
        <Button type="primary">Ok</Button>,
      ]}
    >
      {content}
    </Modal>
  );
}
