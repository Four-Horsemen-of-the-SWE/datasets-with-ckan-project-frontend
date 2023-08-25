import { Avatar, Space, Table, Tag } from "antd";

const columns = [
  {
    title: "User",
    dataIndex: "name",
    key: "name",
    render: (text) => (
      <Space>
        <Avatar 
          shape="square"
        />
      </Space>
    ),
  },
  {
    render: (value) => (
      <a>asd</a>
    )
  }
];

export default columns;
