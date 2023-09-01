import {
  CloudDownloadOutlined,
  ExpandOutlined,
  CompressOutlined,
} from "@ant-design/icons";
import { Modal, Image, Button } from 'antd'
import React, { useState, useEffect } from 'react'
import axios from "axios";
import { getVisualize } from "../../lib/getVisualization";
import { useDownloadStore, useModalSizeStore } from "../../store";
import moment from "moment";

export default function VisualizationModal({ dataset_id, mimetype, format, url, open, close }) {
  const content = getVisualize(mimetype, url);
  const { isMaximize, setIsMaximize } = useModalSizeStore();
  const { setDownloadStatistic } = useDownloadStore();

  const handleDownload = async (url) => {
    try {
      window.open(url, "_blank");
      const response  = await axios.post(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/${dataset_id}/download`
      );
      if (response.data.ok) {
        setDownloadStatistic({
          labels: response.data.result.map((item) =>
            moment(item.download_date).format("LL")
          ),
          datasets: [
            {
              label: "Download",
              backgroundColor: "#1677FF",
              borderColor: "#1677FF",
              borderWidth: 2,
              data: response.data.result.map((item) => item.download_count),
            },
          ],
          total_download: response.data.total_download,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      destroyOnClose={true}
      title="Visualization window"
      width={
        isMaximize
          ? "100%"
          : mimetype?.split("/")[0] === "image"
          ? "auto"
          : "50%"
      }
      height={isMaximize ? "100%" : "auto"}
      open={open}
      onCancel={close}
      maskClosable={false}
      centered={true}
      afterClose={() => setIsMaximize(false)}
      footer={[
        <Button size="large" onClick={close}>
          Cancel
        </Button>,
        <Button
          size="large"
          className="mb-4"
          icon={isMaximize ? <CompressOutlined /> : <ExpandOutlined />}
          onClick={() => setIsMaximize(!isMaximize)}
        >
          {isMaximize ? "Minimize view" : "Maximize view"}
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
