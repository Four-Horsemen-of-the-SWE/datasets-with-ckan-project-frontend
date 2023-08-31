import { useEffect, useState } from "react";
import { useAuthHeader, useAuthUser, useIsAuthenticated } from "react-auth-kit";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Space, Avatar, Input, Form, Button, Typography, Card, Tag, message, Popconfirm } from "antd";
import axios from "axios";
import VoteButton from "./VoteButton";

const { Title, Paragraph } = Typography;

export default function TopicCard({ discussion_data }) {
  const [discussion, setDiscussion] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [form] = Form.useForm();

  // get jwt token here
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();
  const JWTToken = authHeader().split(" ")[1];

  const handleUpdateTopic = async(values) => {
    try {
      setIsUpdating(true);
      const response = await axios.put(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/discussions/${discussion.id}/topics`,
        values,
        {
          headers: {
            Authorization: JWTToken
          }
        }
      );
      if(response.data.ok) {
        message.success("Topic were successfully updated.");
        // then set topic information with new data
        setDiscussion({...discussion, ...response.data.result});

        setTimeout(()  => {
          setIsUpdating(false);
          setIsEditMode(false);
        }, 700);
      }
    } catch(error) {
      message.error(error.message);
      setIsUpdating(false);
    }
  }

  const handleDeleteTopic = async () => {
    try {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_CKAN_API_ENDPOINT}/discussions/${discussion.id}/topics`,
          {
            headers: {
              Authorization: JWTToken,
            },
          }
        );
        if (response.data.ok) {
          message.success("Your topic has been deleted.");
          setTimeout(() => {
            window.location.href = window.location.pathname.split('/').slice(0, -1).join('/');
          }, 400);
        }
      } catch (error) {
        message.error(error.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    setDiscussion(discussion_data)
  }, [discussion_data])
  
  return (
    <Card bordered={true}>
      <div className="flex justify-between w-full items-center space-x-4">
        <Space split="•">
          <Avatar src={discussion.user_image_url} />
          <small>{discussion.user_name}</small>
          <Tag color="green">DATASET CREATOR</Tag>
        </Space>
        <Space>
          {/* action button, edit and delete */}
          {auth()?.id === discussion_data.user_id && (
            <Space>
              {!isEditMode && (
                <Button
                  type={isEditMode ? "dashed" : "ghost"}
                  onClick={() => setIsEditMode(true)}
                >
                  <EditOutlined />
                </Button>
              )}
              <Popconfirm
                title="Delete this topic ?"
                description="Are you sure to delete this topic."
                icon={<DeleteOutlined style={{ color: "red" }} />}
                placement="right"
                onConfirm={handleDeleteTopic}
              >
                <Button type="primary" danger={true} loading={isUpdating}>
                  <DeleteOutlined style={{ color: "white" }} />
                </Button>
              </Popconfirm>
            </Space>
          )}
        </Space>
      </div>

      {/* topic show in edit mode */}
      {isEditMode ? (
        <>
          <Form
            form={form}
            layout="vertical"
            className="mt-4"
            initialValues={{ title: discussion.title, body: discussion.body }}
            onFinish={handleUpdateTopic}
          >
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
              <Input size="large" placeholder="Topic title." />
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
                size="large"
                placeholder="Give feedback and ask questions about the dataset or share your insights with the community."
              />
            </Form.Item>
            <Form.Item style={{ float: "right" }}>
              <Space>
                <Button onClick={() => setIsEditMode(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Update Topic
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </>
      ) : (
        <div className="flex flex-row items-center justify-between gap-4">
          <Space direction="vertical">
            <Title level={2}>{discussion.title}</Title>
            <Paragraph ellipsis={{ rows: 4, symbol: "more" }}>
              {discussion.body}
            </Paragraph>
          </Space>
          <Space direction="vertical" align="center">
            <VoteButton
              target_id={discussion_data.id}
              target_type="topic"
              vote={discussion_data.vote}
              vote_type={discussion_data.voted_type}
            />
          </Space>
        </div>
      )}
    </Card>
  );
}