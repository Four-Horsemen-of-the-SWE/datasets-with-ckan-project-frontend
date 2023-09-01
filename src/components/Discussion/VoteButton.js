import { ArrowUpOutlined, ArrowDownOutlined, StarOutlined } from "@ant-design/icons";
import { Button, Space, Tooltip, message } from "antd";
import { useAuthHeader, useIsAuthenticated, useAuthUser } from "react-auth-kit";
import { useEffect, useState } from "react";
import axios from "axios";

export default function VoteButton({ target_id, target_type, vote = 0, vote_type, size="middle", direction = "vertical" }) {
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();
  const [voteScore, setVoteScore] = useState(vote);
  const [voteState, setVoteState] = useState(vote_type);

  const config = isAuthenticated()
    ? {
        headers: {
          Authorization: authHeader().split(" ")[1],
        },
      }
    : {};

  const handleVote = async (vote_type) => {
    try {
      if (vote_type === voteState) {
        vote_type = "neutral";
      }

      const response = await axios.post(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/votes/`,
        {
          target_id: target_id,
          target_type: target_type,
          vote_type: vote_type,
        },
        config
      );

      if (response.data.ok) {
        // update vote score
        const vote_score = getVoteState(voteState, vote_type);
        setVoteScore(voteScore + vote_score);
        // set vote state
        setVoteState(vote_type);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const getVoteState = (oldVote, newVote) => {
    if (oldVote === "downvote") {
      return newVote === "neutral" ? 1 : 2;
    } else if (oldVote === "upvote") {
      return newVote === "neutral" ? -1 : -2;
    } else {
      return newVote === "upvote" ? 1 : -1;
    }
  };

  useEffect(() => {
    setVoteScore(vote);
    setVoteState(vote_type);
  }, [vote, vote_type]);

  if (auth()?.is_admin) {
    return;
  }

  if (isAuthenticated()) {
    return (
      <>
        <Space align="center" direction={direction}>
          <Button
            type="ghost"
            shape="circle"
            icon={<ArrowUpOutlined />}
            size={size}
            style={{ color: voteState === "upvote" ? "red" : "" }}
            onClick={() => handleVote("upvote")}
          />

          {voteScore}

          <Button
            type="ghost"
            shape="circle"
            icon={<ArrowDownOutlined />}
            size={size}
            style={{ color: voteState === "downvote" ? "red" : "" }}
            onClick={() => handleVote("downvote")}
          />
        </Space>
      </>
    );
  } else {
    return (
      <Tooltip title="Please login to vote.">
        <Space align="center" direction={direction}>
          <Button
            type="ghost"
            shape="circle"
            icon={<ArrowUpOutlined />}
            size={size}
            style={{ color: "gray" }}
            disabled={true}
          />

          {voteScore}

          <Button
            type="ghost"
            shape="circle"
            icon={<ArrowDownOutlined />}
            size={size}
            style={{ color: "gray" }}
            disabled={true}
          />
        </Space>
      </Tooltip>
    );
  }
}