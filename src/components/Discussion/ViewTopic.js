import { CaretUpOutlined, CaretDownOutlined, CommentOutlined, LeftOutlined, CalendarOutlined } from "@ant-design/icons";
import { Avatar, Card, Divider, Space, Typography, Button, Input, List, Tag } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;

export default function ViewTopic({ topic_id, dataset_creator_user_id }) {
  const [discussion, setDiscussion] = useState({});
  const fetchDiscussion = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_CKAN_API_ENDPOINT}/discussions/topic/${topic_id}`
    );
    if (response.data.ok) {
      setDiscussion(response.data.result);
    }
  };

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  useEffect(() => {
    fetchDiscussion();
  }, []);

  return (
    <>
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
            <Avatar />
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
    </>
  );
}