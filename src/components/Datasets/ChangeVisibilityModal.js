import { ArrowRightOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons"
import { Button, Modal, Typography, message } from 'antd'
import axios from "axios";
import { useAuthHeader } from "react-auth-kit";
import React, { useState } from 'react'

export default function ChangeVisibilityModal({dataset_id, is_private, open, close}) {
  const [isLoading, setIsLoading] = useState(false);
  const authHeader = useAuthHeader();

  const config = {
    headers: {
      Authorization: authHeader().split(" ")[1]
    }
  }

  const handleChangeVisibility = async() => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/visibility`,
        {
          dataset_id: dataset_id,
          visibility: is_private ? "public" : "private"
        },
        config
      );

      if(response.data.ok) {
        message.success("Change visibility success");
        setTimeout(() => {
          setIsLoading(false)
          window.location.reload();
        }, 400);
      } else {
        setIsLoading(false);
      }
    } catch(error) {
      setIsLoading(false);
      message.error("change visibility failed.");
      console.error(error);
    }
  }

  return (
    <Modal
      open={open}
      close={close}
      onCancel={close}
      centered={true}
      title={`Make this dataset to ${is_private ? "Public" : "Private"}`}
      footer={[
        <Button type="primary" size="large" block={true} danger={true} onClick={handleChangeVisibility}>
          I want to make this dataset {is_private ? "Public" : "Private"}
        </Button>,
      ]}
    >
      <div className="w-full h-fit flex flex-col gap-y-5 items-center justify-center text-center">
        <div className="flex text-gray-600 gap-x-10 text-5xl mt-7">
          {is_private ? (
            <>
              <EyeInvisibleOutlined />
              <ArrowRightOutlined />
              <EyeOutlined />
            </>
          ) : (
            <>
              <EyeOutlined />
              <ArrowRightOutlined />
              <EyeInvisibleOutlined />
            </>
          )}
        </div>

        <Typography.Title level={4}>
          {is_private
            ? "This will allow others to see your data including your dataset file."
            : "This will make your data including your dataset files invisible to others. until you change it back to public"}
        </Typography.Title>
      </div>
    </Modal>
  );
}
