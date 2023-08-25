import { DeleteOutlined } from "@ant-design/icons";
import { Avatar, Button, Space, Table, Tag } from "antd";
import { Link } from "react-router-dom";

const columns = [
  {
    title: "User",
    dataIndex: "name",
    key: "name",
    render: (text, record) => (
      <Space>
        <Avatar
          src={
            record.image_url
              ? record.image_url
              : process.env.PUBLIC_URL + "/images/no_avatar.png"
          }
          shape="square"
        />
        <Link to={`/profile/${text}`} target="_blank">{text}</Link>
      </Space>
    ),
  },
  {
    align: "center",
    render: (value) => <Button icon={<DeleteOutlined />} danger={true} />,
  },
];

export default columns;
