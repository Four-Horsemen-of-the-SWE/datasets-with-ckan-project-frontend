import { CaretUpOutlined, CaretDownOutlined, CommentOutlined, LeftOutlined, CalendarOutlined } from "@ant-design/icons";
import { Avatar, Card, Divider, Space, Typography, Button, Input, List, Tag, Tooltip, message, Form } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthUser, useAuthHeader } from "react-auth-kit";

const { Title, Paragraph } = Typography;

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

export default function ViewTopic({ topic_id, dataset_creator_user_id }) {
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
   const JWTToken = authHeader().split(" ")[1];

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [discussion, setDiscussion] = useState({});

  const fetchDiscussion = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_CKAN_API_ENDPOINT}/discussions/topic/${topic_id}`
    );
    if (response.data.ok) {
      setDiscussion(response.data.result);
    }
  };
  
  console.log(discussion.comments)

  const handleCreateComment = async(value) => {
    try {
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
      }
    } catch(error) {
      messageApi.error(error.message);
    }
  }

  useEffect(() => {
    fetchDiscussion();
  }, []);

  return (
    <>
      {contextHolder}

      <Link
        to={`/${window.location.pathname.split("/").slice(1, 4).join("/")}`}
      >
        <Button type="dashed" icon={<LeftOutlined />} className="mb-3">
          Back to Topic
        </Button>
      </Link>

      <Card bordered={true}>
        <div className="flex justify-between w-full items-center space-x-4">
          <Space split="•">
            <Avatar src={discussion.user_image_url} />
            <small>{discussion.user_name}</small>
            <Tag color="green">DATASET CREATOR</Tag>
          </Space>
          <Space.Compact size="middle">
            <Button>
              <CaretUpOutlined />
            </Button>
            <Input
              disabled
              defaultValue={0}
              style={{ width: "40px", textAlign: "center" }}
            />
            <Button>
              <CaretDownOutlined />
            </Button>
          </Space.Compact>
        </div>
        <Title level={2}>{discussion.title}</Title>
        <Paragraph ellipsis={{ rows: 4, symbol: "more" }}>
          {discussion.body}
        </Paragraph>
      </Card>

      <Divider />

      <Title level={4} style={{ marginTop: 0 }}>
        <Space>
          <CommentOutlined />
          <p>{discussion.comments_count} Comments</p>
        </Space>
      </Title>

      <List
        itemLayout="vertical"
        size="large"
        dataSource={discussion.comments}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              <IconText
                icon={CalendarOutlined}
                text={moment(item.created).format("LLL")}
              />,
            ]}
            extra={
              dataset_creator_user_id === item.user_id && (
                <Tag color="green">DATASET CREATOR</Tag>
              )
            }
          >
            <List.Item.Meta
              avatar={<Avatar src={item?.user_image_url} />}
              title={item.user_name}
              description={item.body}
            />
          </List.Item>
        )}
      />

      <Divider />

      {/* create comment section */}
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
              placeholder="Reply to comments on this topic."
              allowClear={true}
              showCount={true}
              maxLength={1000}
            />
          </Form.Item>
        </div>
        <Form.Item style={{ alignSelf: "end" }}>
          <Tooltip title="Add Comment." placement="left">
            <Button
              type="primary"
              size="large"
              className="self-end"
              htmlType="submit"
            >
              Create Comment
            </Button>
          </Tooltip>
        </Form.Item>
      </Form>
    </>
  );
}