import React, { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Typography, Empty, Spin } from "antd";
import ArticleEditor from "./ArticleEditor";
import ArticleRead from "./ArticleRead";
import { useAuthUser } from "react-auth-kit";
import axios from "axios";

export default function ArticleView({ dataset_id, creator_user_id }) {
  const auth = useAuthUser();
  const [isEditMode, setIsEditMode] = useState(false);
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    fetchArticle();
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
      content={article}
      dataset_id={dataset_id}
      setIsEditMode={setIsEditMode}
    />
  ) : (
    <ArticleRead
      content={article}
      setIsEditMode={setIsEditMode}
      creator_user_id={creator_user_id}
    />
  );
}
