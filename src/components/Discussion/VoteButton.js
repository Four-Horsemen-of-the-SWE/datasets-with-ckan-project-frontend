import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { Space, Button, Input, message } from "antd";
import { useAuthHeader, useIsAuthenticated } from "react-auth-kit";
import axios from "axios";
import { useState } from "react";

export default function VoteButton({ target_id, target_type, vote = 0, vote_type, size="middle" }) {
  const authHeader = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();
  const [success, setSuccess] = useState(false);

  const config = isAuthenticated() ?  {
    headers: {
      Authorization: authHeader().split(" ")[1],
    }
  } : {};

  const handleVote = async(vote_type) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/votes/`,
        {
          target_id: target_id,
          target_type: target_type,
          vote_type: vote_type,
        },
        config
      );

      if(response.data.ok) {
        message.success(response.data.message);
      }
    } catch(error) {
      message.error(error.message);
    }
  }

  const upvote = vote_type === "upvote";
  const downvote = vote_type === "downvote";

  return (
    <Space.Compact size={size}>
      <Button type={upvote ? "primary" : "default"} onClick={() => handleVote("upvote")}>
        <CaretUpOutlined />
      </Button>
      <Input
        disabled={true}
        style={{ width: "40px", textAlign: "center" }}
        value={vote}
      />
      <Button type={downvote ? "primary" : "default"}  onClick={() => handleVote("downvote")}>
        <CaretDownOutlined />
      </Button>
    </Space.Compact>
  );
}