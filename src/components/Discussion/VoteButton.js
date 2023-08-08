import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { Space, Button, Input, message } from "antd";
import {useAuthHeader} from 'react-auth-kit';
import axios from "axios";
import { useEffect, useState } from "react";

export default function VoteButton({ target_id, target_type, vote = 0, size="middle" }) {
  const authHeader = useAuthHeader();
  const [success, setSuccess] = useState(false);

  const handleVote = async(vote_type) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/votes/`,
        {
          target_id: target_id,
          target_type: target_type,
          vote_type: vote_type,
        },
        {
          headers: {
            Authorization: authHeader().split(" ")[1],
          },
        }
      );

      if(response.data.ok) {
        message.success(response.data.message);
      }
    } catch(error) {
      message.error(error.message);
    }
  }

  return (
    <Space.Compact size={size}>
      <Button onClick={() => handleVote("upvote")}>
        <CaretUpOutlined />
      </Button>
      <Input
        disabled={true}
        style={{ width: "40px", textAlign: "center" }}
        value={vote}
      />
      <Button onClick={() => handleVote("downvote")}>
        <CaretDownOutlined />
      </Button>
    </Space.Compact>
  );
}