import React, { useState } from "react";
import { Button, Form, Input, Modal, message } from "antd";
import { useAuthHeader } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateTopicModal({ dataset_id, isOpen, close, topics, setTopics }) {
  const authHeader = useAuthHeader();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const JWTToken = authHeader().split(" ")[1];
  const navigate = useNavigate();

  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTopic = async () => {
    try {
      setIsCreating(true);
      const values = await form.validateFields();

      const response = await axios.post(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/discussions/${dataset_id}/topics`,
        values,
        {
          headers: {
            Authorization: JWTToken,
          },
        }
      );

      if(response.data.ok) {
        // then redirect to topic view page
        messageApi.success("Create success.");

        // add create topic into list
        setTopics(prevState => [...prevState, response.data.result])
        setTimeout(() => {
          close();
          setIsCreating(false);
          return navigate(response.data.result?.id);
        }, 550);
      }
    } catch (error) {
      setIsCreating(false);
      messageApi.error("Cannot createtopic.");
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Create new topic"
        open={isOpen}
        onCancel={close}
        maskClosable={false}
        footer={[
          <Button size="large" onClick={() => close()}>
            Cancel
          </Button>,
          <Button size="large" type="primary" onClick={handleCreateTopic} loading={isCreating}>
            Create Topic
          </Button>,
        ]}
        centered={true}
        forceRender={true}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: "Please enter a title for the topic.",
              },
            ]}
          >
            <Input
              placeholder="Topic Title"
              size="large"
              maxLength={50}
              showCount={true}
            />
          </Form.Item>
          <Form.Item
            label="Message"
            name="body"
            rules={[
              {
                required: true,
                message: "Please enter a message for the topic.",
              },
            ]}
          >
            <Input.TextArea
              rows={6}
              maxLength={255}
              showCount={true}
              size="large"
              placeholder="Give feedback and ask questions about the dataset or share your insights with the community."
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
