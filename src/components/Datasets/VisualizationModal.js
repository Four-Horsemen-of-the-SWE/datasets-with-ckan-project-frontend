import { CloudDownloadOutlined } from "@ant-design/icons";
import { Modal, Image, Button } from 'antd'
import React, { useState, useEffect } from 'react'
import { getVisualize } from "../../lib/getVisualization";


export default function VisualizationModal({ resource_id, mimetype, format, url, open, close }) {
  const content = getVisualize(mimetype, url);

  return (
    <Modal
      title="Visualization window"
      width={1000}
      open={open}
      onCancel={close}
      maskClosable={false}
      centered={true}
      footer={[
        <Button size="large" onClick={close}>Cancel</Button>,
        <Button size="large" type="primary" icon={<CloudDownloadOutlined />}>Download</Button>
      ]}
    >
      {content}
    </Modal>
  );
}
