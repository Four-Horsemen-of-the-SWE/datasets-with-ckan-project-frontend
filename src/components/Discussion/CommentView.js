import React, { useState } from "react";
import { useAuthUser, useAuthHeader, useIsAuthenticated } from "react-auth-kit";
import { CalendarOutlined, DeleteOutlined, EditOutlined, FlagOutlined } from "@ant-design/icons";
import { List, Space, Button, Typography, Avatar, Popconfirm, Tag, message, Form, Input, Tooltip  } from "antd";
import axios from "axios";
import moment from "moment";

// components
import VoteButton from "./VoteButton";
import ReportButton from "../Button/ReportButton";

const IconText = ({ icon, text, color = "grey" }) => (
  <Space>
    {React.createElement(icon, { style: {color: color }})}
    <span>{text}</span>
  </Space>
);

const format_date = (date) => {
  const result =
    moment.utc(date).toDate() &&
    moment(moment.utc(date).toDate()).format("MMMM Do YYYY, h:mm:ss a");
  return result;
};

export default function CommentView({ item, dataset_creator_user_id, updateComment, deleteComment, setDiscussion, type = "discussions" }) {
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();
  const JWTToken = authHeader().split(" ")[1];
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();

  const handleUpdateComment = async (value) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/${type}/comments/${item.id}`,
        value,
        {
          headers: {
            Authorization: JWTToken,
          },
        }
      );

      if (response.data.ok) {
        message.success("Comment were updated successful.");
        // replace old comment data with new updated comment
        updateComment(item, response.data.result);
        setIsEditMode(false);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleDeleteComment = async (comment_id) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/${type}/comments/${comment_id}`,
        {
          headers: {
            Authorization: JWTToken,
          },
        }
      );

      if (response.data.ok) {
        message.success("Delete success.");
        // then delete from state
        deleteComment(comment_id)
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <List.Item
      key={item.id}
      actions={[
        <IconText icon={CalendarOutlined} text={format_date(item.created)} />,
        isAuthenticated() && (
          <ReportButton
            entity_id={item.id}
            entity_type="comment"
            entity_owner={item.user_id}
          />
        )
      ]}
      extra={
        <Space align="end" direction="vertical">
          {auth()?.id === item.user_id && (
            <Space size="small">
              {!isEditMode && (
                <Button
                  type="ghost"
                  size="small"
                  onClick={() => setIsEditMode(true)}
                >
                  <EditOutlined />
                </Button>
              )}
              <Popconfirm
                title="Delete this comment ?"
                description="Are you sure to delete this comment."
                icon={<DeleteOutlined style={{ color: "red" }} />}
                placement="right"
                onConfirm={() => handleDeleteComment(item.id)}
              >
                <Button
                  shape="square"
                  type="primary"
                  size="small"
                  danger={true}
                >
                  <DeleteOutlined />
                </Button>
              </Popconfirm>
            </Space>
          )}
          {/* vote button */}
          {isAuthenticated() && (
            <VoteButton
              target_id={item.id}
              target_type="comment"
              vote={item.vote}
              vote_type={item.voted_type}
              size="small"
            />
          )}
        </Space>
      }
    >
      <List.Item.Meta
        avatar={<Avatar src={item?.user_image_url} />}
        title={
          <>
            {item.user_name} {/* if user is dataset creator */}
            {dataset_creator_user_id === item.user_id && (
              <Tag color="green">DATASET CREATOR</Tag>
            )}
            {/* if user is admin */}
            {item.is_admin && <Tag color="red">ADMIN</Tag>}
          </>
        }
        description={
          isEditMode ? (
            <Form
              layout="vertical"
              initialValues={{ body: item.body }}
              onFinish={handleUpdateComment}
              form={form}
            >
              <Form.Item
                name="body"
                rules={[
                  {
                    required: true,
                    message: "Please enter a message for comment.",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  allowClear={true}
                  showCount={true}
                  maxLength={500}
                  placeholder="Reply to the topic."
                />
              </Form.Item>
              <Form.Item style={{ float: "right" }}>
                <Space>
                  <Button onClick={() => setIsEditMode(false)}>Cancel</Button>
                  <Button type="primary" htmlType="submit">
                    Update Comment
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          ) : (
            <Typography.Paragraph
              ellipsis={{
                rows: 4,
                expandable: false,
                symbol: "more",
              }}
            >
              {item.body}
            </Typography.Paragraph>
          )
        }
      />
    </List.Item>
  );
}