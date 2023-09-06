import React, { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Typography, Empty, Spin, Form, Avatar, Input, Divider, List, Row, Col, Card } from "antd";
import { useAuthUser, useIsAuthenticated, useAuthHeader } from "react-auth-kit";
import axios from "axios";
import ArticleReader from "./ArticleReader";
import ArticleCreate from "./ArticleCreate";

export default function ArticleView({ dataset_id, creator_user_id }) {
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isCreatingComment, setIsCreatingComment] = useState(false);

  const JWTToken = authHeader().split(" ")[1];
  
  const config = isAuthenticated()
    ? {
        headers: {
          Authorization: JWTToken,
        },
      }
    : {};

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/${dataset_id}/articles`
      );
      console.log(response.data);
      if (response.data.ok) {
        setIsLoading(false);

        

        // if dataset is created.
        if (response.data?.is_created) {
          setArticles(response.data.result);
          
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
    fetchArticles();
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

  if (isCreateMode) {
    return <ArticleCreate dataset_id={dataset_id} cancel={() => setIsCreateMode(false)} />
  }

  if (selectedArticle) {
    return (
      <ArticleReader
        article_id={selectedArticle}
        close={() => setSelectedArticle(null)}
        dataset_id={dataset_id}
        creator_user_id={selectedArticle.user_id}
      />
    );
  }

  return (
    <div className="container mx-auto mb-5">
      <div className="flex items-center justify-between">
        <Typography.Title level={2}>All Articles</Typography.Title>
        {!auth()?.is_admin && (
          <Button icon={<PlusOutlined />} onClick={() => setIsCreateMode(true)}>Create article</Button>
        )}
      </div>

      {/* display all dataset */}
      <Row gutter={18}>
        {articles?.map((item, key) => (
          <Col sm={12} md={8} key={key}>
            <Card
              cover={
                <img
                  alt="article thumbnail"
                  src={
                    item.thumbnail ||
                    process.env.PUBLIC_URL + "/images/placeholder/image.jpg"
                  }
                />
              }
            >
              <Card.Meta
                title={item.title}
                description="Click to view this article"
                className="cursor-pointer"
                onClick={() => setSelectedArticle(item.id)}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
