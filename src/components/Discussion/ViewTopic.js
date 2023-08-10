import {
  CommentOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { Avatar, Divider, Space, Typography, Button, Input, List, message, Form } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthUser, useAuthHeader, useIsAuthenticated } from "react-auth-kit";
import TopicCard from "./TopicCard";
import CommentView from "./CommentView";

const { Title } = Typography;

export default function ViewTopic({ topic_id, dataset_creator_user_id }) {
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
   const isAuthenticated = useIsAuthenticated();
  const JWTToken = authHeader().split(" ")[1];

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [discussion, setDiscussion] = useState({});
  const [isCommentCreating, setIsCommentCreating] = useState(false);

  const config = isAuthenticated() ? {
    headers: {
      Authorization: JWTToken
    }
  } : {};

  const fetchDiscussion = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_CKAN_API_ENDPOINT}/discussions/topic/${topic_id}`,
      config
    );
    
    if (response.data.ok) {
      setDiscussion(response.data.result);
    }
  };

  const handleCreateComment = async(value) => {
    try {
      setIsCommentCreating(true);
      const response = await axios.post(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/discussions/comments/${topic_id}`,
        value,
        {
          headers: {
            Authorization: JWTToken
          }
        }
      );

      if(response.data.ok) {
        messageApi.success("Create comment success.");
        setIsCommentCreating(false);
        // if success. then add new comment into state
        if(discussion.comments?.length) {
          setDiscussion({
            ...discussion,
            comments: [...discussion.comments, response.data.result],
          });
        } else {
          setDiscussion({
            ...discussion,
            comments: [response.data.result],
          });
        }

        // clear text area
        form.resetFields(["body"]);
      }
    } catch(error) {
      messageApi.error(error.message);
      setIsCommentCreating(false);
    }
  }

  useEffect(() => {
    fetchDiscussion();
  }, []);

  return (
    <>
      {contextHolder}

      <a href={`/${window.location.pathname.split("/").slice(1, 4).join("/")}`}>
        <Button type="dashed" icon={<LeftOutlined />} className="mb-3">
          Back to discussion
        </Button>
      </a>

      {/* topic details show here */}
      <TopicCard discussion_data={discussion} />

      <Divider />

      <Title level={4} style={{ marginTop: 0 }}>
        <Space>
          <CommentOutlined />
          <p>{discussion.comments?.length} Comments</p>
        </Space>
      </Title>

      {/* comments list */}
      <List
        itemLayout="vertical"
        size="large"
        dataSource={discussion.comments}
        renderItem={(item) => (
          <CommentView
            item={item}
            dataset_creator_user_id={dataset_creator_user_id}
            setDiscussion={setDiscussion}
          />
        )}
      />

      <Divider />

      {/* create comment section */}
      {isAuthenticated() && (
        <Form
          form={form}
          style={{ width: "100%", display: "flex", flexDirection: "column" }}
          onFinish={handleCreateComment}
          layout="vertical"
        >
          <div className="flex gap-2 items-start w-full">
            <Avatar src={auth()?.image_url} />
            <Form.Item
              style={{ width: "100%" }}
              name="body"
              rules={[
                {
                  required: true,
                  message: "Please enter a message for comment.",
                },
              ]}
            >
              <Input.TextArea
                rows={6}
                placeholder="Reply to the topic."
                allowClear={true}
                showCount={true}
                maxLength={500}
              />
            </Form.Item>
          </div>
          <Form.Item style={{ alignSelf: "end" }}>
            <Button
              type="primary"
              size="large"
              className="self-end"
              htmlType="submit"
              loading={isCommentCreating}
            >
              Create Comment
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
}