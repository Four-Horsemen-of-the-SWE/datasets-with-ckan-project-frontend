import { CloudDownloadOutlined } from "@ant-design/icons";
import { Modal, Image, Button } from 'antd'
import React, { useState, useEffect } from 'react'
import axios from "axios";
import { getVisualize } from "../../lib/getVisualization";

export default function VisualizationModal({ dataset_id, mimetype, format, url, open, close }) {
  const content = getVisualize(mimetype, url);

  const handleDownload = async (url) => {
    try {
      window.open(url, "_blank");
      await axios.post(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/${dataset_id}/download`
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      title="Visualization window"
      width={"75%"}
      open={open}
      onCancel={close}
      maskClosable={false}
      centered={true}
      footer={[
        <Button size="large" onClick={close}>
          Cancel
        </Button>,
        <Button
          size="large"
          type="primary"
          icon={<CloudDownloadOutlined />}
          onClick={() => handleDownload(url)}
        >
          Download
        </Button>,
      ]}
    >
      {content}
    </Modal>
  );
}
