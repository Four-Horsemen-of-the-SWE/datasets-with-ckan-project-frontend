import React, { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Typography, Empty, Spin, Form, Avatar, Input, Divider, List } from "antd";
import ArticleEditor from "./ArticleEditor";
import ArticleRead from "./ArticleRead";
import { useAuthUser, useIsAuthenticated, useAuthHeader } from "react-auth-kit";
import axios from "axios";
import CommentView from "../Discussion/CommentView";

const data = [
  "Racing car sprays burning fuel into crowd.",
  "Japanese princess to wed commoner.",
  "Australian walks 100km after outback crash.",
  "Man charged over missing wedding girl.",
  "Los Angeles battles huge wildfires.",
];

export default function ArticleView({ dataset_id, creator_user_id }) {
  const [form] = Form.useForm();
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const JWTToken = authHeader().split(" ")[1];
  
  const config = isAuthenticated()
    ? {
        headers: {
          Authorization: JWTToken,
        },
      }
    : {};

  const fetchArticle = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/articles/${dataset_id}`
      );
      if (response.data.ok) {
        setIsLoading(false);

        // if dataset is created.
        if (response.data?.is_created) {
          setArticle(response.data.result);
          
        }
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const fetchcomments = async() => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/articles/${"fec248ae-9328-4880-9116-476853ab4836"}/comments`,
        config
      );

      if(response.data.ok) {
        setComments(response.data.result);
      }
    } catch(error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchArticle();
    fetchcomments();
  }, []);

  // loading
  if (isLoading) {
    return (
      <div className="w-full h-96 flex flex-col gap-4 items-center justify-center">
        <Spin size="large" />
        <Typography.Text type="secondary">Loading...</Typography.Text>
      </div>
    );
  }
  // empty
  if (article === null && isEditMode === false) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Empty description="No Article">
          {creator_user_id === auth()?.id && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsEditMode(true)}
            >
              Create Article
            </Button>
          )}
        </Empty>
      </div>
    );
  }

  return isEditMode ? (
    <ArticleEditor
      content={article?.content}
      dataset_id={dataset_id}
      setIsEditMode={setIsEditMode}
    />
  ) : (
    <>
      {/* article details view */}
      <ArticleRead
        content={article?.content}
        setIsEditMode={setIsEditMode}
        creator_user_id={creator_user_id}
      />
      {/* comment section */}
      {isAuthenticated() && (
        <Form
          form={form}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            margin: "1.5em 0px",
          }}
          onFinish={null}
          layout="vertical"
        >
          <Divider />
          
          <Typography.Title level={3}>Conversation</Typography.Title>

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
              loading={null}
            >
              Create Comment
            </Button>
          </Form.Item>
        </Form>
      )}
      '
      <Divider />

      <List
        className="mb-5"
        itemLayout="vertical"
        size="large"
        dataSource={comments}
        renderItem={(item) => (
          <CommentView dataset_creator_user_id={"asd"} item={item} />
        )}
      />
    </>
  );
}
