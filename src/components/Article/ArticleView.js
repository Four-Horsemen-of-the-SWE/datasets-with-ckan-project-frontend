import React, { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Typography, Empty, Spin, Form, Avatar, Input, Divider, List } from "antd";
import { useAuthUser, useIsAuthenticated, useAuthHeader } from "react-auth-kit";
import axios from "axios";
import CommentView from "../Discussion/CommentView";
import ArticleEditor from "./ArticleEditor";
import ArticleReader from "./ArticleReader";

export default function ArticleView({ dataset_id, creator_user_id }) {
  const [form] = Form.useForm();
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [isCreatingComment, setIsCreatingComment] = useState(false);

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
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/articles/${article?.id}/comments`,
        config
      );

      if(response.data.ok) {
        setComments(response.data.result);
      }
    } catch(error) {
      console.error(error);
    }
  }

  const handleCreateComment = async(values) => {
    const payload = {
      article_id: article?.id,
      body: values.body,
    };

    try {
      setIsCreatingComment(true);
      const response = await axios.post(`${process.env.REACT_APP_CKAN_API_ENDPOINT}/articles/comments`, payload, config);

      if(response.data.ok) {
        form.resetFields();
        setComments([...comments, response.data.result]);
        setIsCreatingComment(false);
      } else {
        setIsCreatingComment(false);
      }
    }catch(error){
      setIsCreatingComment(false);
      console.error(error);
    }
  }

  const updateData = (item, new_data) => {
    setComments((prevState) =>
      prevState.map((comment) => (comment.id === item.id ? new_data : comment))
    );
  }

  const deleteData = (comment_id) => {
    setComments((prevState) => (
      prevState.filter(comment => comment.id !== comment_id)
    ))
  }

  useEffect(() => {
    fetchArticle();
  }, []);

  useEffect(() => {
    fetchcomments();
  }, [article]);

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

  console.log(comments);

  if(isEditMode) {
    return(
      <ArticleEditor
        content={article?.content}
        dataset_id={dataset_id}
        setIsEditMode={setIsEditMode}
      />
    )
  } else {
    return (
      <>
        {/* article details view */}
        <ArticleReader
          article_id={article?.id}
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
            onFinish={handleCreateComment}
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
                  placeholder="Comment on an article."
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
                loading={isCreatingComment}
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
            <CommentView
              dataset_creator_user_id={creator_user_id}
              setDiscussion={setComments}
              item={item}
              type="articles"
              deleteComment={deleteData}
              updateComment={updateData}
            />
          )}
        />
      </>
    );
  }
}
