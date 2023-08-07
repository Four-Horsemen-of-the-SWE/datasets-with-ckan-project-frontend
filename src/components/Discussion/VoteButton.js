import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { Space, Button, Input } from "antd";

export default function VoteButton({ size="middle" }) {
  const handleUpvote = () => {

  }

  const handleDownVote = () => {
    
  }

  return (
    <Space.Compact size={size}>
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
  );
}