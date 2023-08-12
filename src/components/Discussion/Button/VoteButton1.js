import { ArrowUpOutlined, ArrowDownOutlined, StarOutlined } from "@ant-design/icons";
import { Button, Space, message } from "antd";
import { useAuthHeader, useIsAuthenticated } from "react-auth-kit";
import { useState } from "react";
import axios from "axios";

export default function VoteButton1({ target_id, target_type, vote = 0, vote_type, size="middle" }) {
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

  const handleVote = async(vote_type) => {
    try {
      // if vote_type === voteState is mean user want to clear voted
      if(vote_type === voteState) {
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
        const vote_score = getVoteState(voteState, vote_type)
        setVoteScore(voteScore + vote_score);
        // set vote state
        setVoteState(vote_type);
      }
    } catch (error) {
      message.error(error.message);
    }
  }

  const getVoteState = (oldVote, newVote) => {
    console.log(`old -> ${oldVote}, new -> ${newVote}`)
    if(oldVote === "downvote") {
      return newVote === "neutral" ? 1 : 2
    } else if (oldVote === "upvote") {
      return newVote === "neutral" ? -1 : -2
    } else {
      return newVote === "upvote" ? 1 : -1;
    }
  };


  return (
    <>
      <Space align="center" direction="vertical">
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
}