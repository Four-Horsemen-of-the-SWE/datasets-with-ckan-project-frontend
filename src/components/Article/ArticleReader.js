import EditorJs from "@natterstefan/react-editor-js";
import { EDITOR_JS_TOOLS } from "./tools";
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Divider, Space, Spin, Typography, message, Avatar, Form, Input, List } from "antd";
import { useAuthHeader, useAuthUser, useIsAuthenticated } from "react-auth-kit";
import { useState, useEffect } from "react";
import axios from "axios";
import ArticleEditor from "./ArticleEditor";
import ArticleDeleteModal from "./ArticleDeleteModal";
import CommentView from "../Discussion/CommentView";

const defaultContent = {
  time: Date.now(),
  blocks: [
    {
      type: "paragraph",
      data: {
        text: "Your content goes here.",
      },
    },
  ],
};

export default function ArticleReader({ article_id, close, dataset_id, creator_user_id }) {
  var editor = null;
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();
  const [article, setArticle] = useState(defaultContent);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [isCreatingComment, setIsCreatingComment] = useState(false);
  const [acknowledgements, setAcknowledgements] = useState([]);

  const config = {
    headers: {
      Authorization: authHeader()?.split(" ")[1],
    },
  };

  const handleReady = async () => {
    if (editor) {
      await editor.render(article?.content || defaultContent);
    }
  };

  const fetchArticle = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/articles/${article_id}`
      );
      if(response.data.ok) {
        setArticle(response.data.result);
      } else {
        message.error("failed to fetch article")
      }
      setIsLoading(false);
    } catch(error) {
      setIsLoading(false);
      console.error(error);
      message.error("cannot fetch article")
    }
  }

  const fetchcomments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/articles/${article?.id}/comments`,
        config
      );

      if (response.data.ok) {
        setAcknowledgements(response.data.result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateComment = async (values) => {
    const payload = {
      article_id: article?.id,
      body: values.body,
    };

    try {
      setIsCreatingComment(true);
      const response = await axios.post(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/articles/comments`,
        payload,
        config
      );

      if (response.data.ok) {
        form.resetFields();
        setAcknowledgements([...acknowledgements, response.data.result]);
        setIsCreatingComment(false);
      } else {
        setIsCreatingComment(false);
      }
    } catch (error) {
      setIsCreatingComment(false);
      console.error(error);
    }
  };

  const updateData = (item, new_data) => {
    setAcknowledgements((prevState) =>
      prevState.map((acknowledgements) => (acknowledgements.id === item.id ? new_data : acknowledgements))
    );
  };

  const deleteData = (comment_id) => {
    setAcknowledgements((prevState) =>
      prevState.filter((acknowledgements) => acknowledgements.id !== comment_id)
    );
  };

  // fetch an artcle
  useEffect(() => {
    fetchArticle();
  }, []);

  // prevent user can do somethin. i forgot
  useEffect(() => {
    // Prevent drag event on images
    const handleDragStart = (event) => {
      const target = event.target;

      // Check if the dragged element is an image
      if (target.tagName === "IMG") {
        event.preventDefault();
      }
    };

    document.addEventListener("dragstart", handleDragStart);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  // fetch acknowledgement
  useEffect(() => {
    fetchcomments();
  }, [article]);


  if(isLoading) {
    return <Spin size="large" />
  }

  if(isEditMode) {
    return <ArticleEditor article_id={article.id} old_title={article.title} content={article?.content} cancel={() => setIsEditMode(false)} dataset_id={dataset_id} />
  }

  return (
    <>
      <ArticleDeleteModal
        article_id={article.id}
        open={showDeleteModal}
        close={() => setShowDeleteModal(false)}
      />

      <Button
        type="dashed"
        size="large"
        icon={<ArrowLeftOutlined />}
        onClick={close}
      >
        Back to all articles
      </Button>

      {auth()?.id === article.user_id && (
        <div className="flex items-center justify-end">
          <Space>
            <Button icon={<EditOutlined />} onClick={() => setIsEditMode(true)}>
              Edit Article
            </Button>
            <Button
              icon={<DeleteOutlined />}
              type="primary"
              danger={true}
              onClick={() => setShowDeleteModal(true)}
            />
          </Space>
        </div>
      )}

      <Typography.Title>{article?.title}</Typography.Title>

      <EditorJs
        tools={EDITOR_JS_TOOLS}
        placeholder="Starting writing content..."
        holder="custom-editor-container"
        readOnly={true}
        editorInstance={(editorInstance) => {
          // invoked once the editorInstance is ready
          editor = editorInstance;
        }}
        onReady={handleReady}
        minHeight={0}
      >
        <div id="custom-editor-container" className="w-full" />
      </EditorJs>

      <Divider />

      {/* acknowledgement */}
      <Typography.Title level={2}>Acknowledgement</Typography.Title>
      {isAuthenticated() && !auth()?.is_admin && (
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
          <div className="flex gap-2 items-start w-full">
            <Avatar src={auth()?.image_url} />
            <Form.Item
              style={{ width: "100%" }}
              name="body"
              rules={[
                {
                  required: true,
                  message: "Please enter a message for acknowledgements.",
                },
              ]}
            >
              <Input.TextArea
                rows={6}
                placeholder="Write your acknowledgment."
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
              Create acknowledgement
            </Button>
          </Form.Item>
        </Form>
      )}

      {/* acknowledgement list */}
      <List
        className="mb-5"
        itemLayout="vertical"
        size="large"
        dataSource={acknowledgements}
        renderItem={(item) => (
          <CommentView
            dataset_creator_user_id={creator_user_id}
            setDiscussion={setAcknowledgements}
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
