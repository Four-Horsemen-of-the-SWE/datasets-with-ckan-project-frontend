import { Link } from "react-router-dom";
import { Button, Image, Space, Tag, Avatar, Badge } from "antd";
import { formatted_date_relative_hour } from "../../../lib/formatted_date";
import UserMenuButton from "./UserMenuButton";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text, record) => (
      <Space>
        <Avatar
          src={
            record.image_display_url
              ? record.image_display_url
              : process.env.PUBLIC_URL + "/images/no_avatar.png"
          }
          shape="square"
          size="large"
        />
        <Space>
          <Link to={`/profile/${text}`}>{text}</Link>
          <Tag color="green">You</Tag>
        </Space>
      </Space>
    ),
  },
  {
    title: "Fullname",
    dataIndex: "fullname",
    key: "fullname",
    render: (name) => (name ? name : "-"),
  },
  {
    title: "Number of Dataset",
    dataIndex: "number_created_packages",
    key: "number_created_packages",
    align: "center",
    sorter: (a, b) => a.number_created_packages - b.number_created_packages,
    render: (number) => number,
  },
  {
    title: "Last Active",
    dataIndex: "last_active",
    key: "last_active",
    render: (date) => formatted_date_relative_hour(date),
  },
  {
    title: "role",
    dataIndex: "sysadmin",
    key: "sysadmin",
    align: "center",
    render: (is_admin) => (
      <Tag color={is_admin ? "red" : "blue"}>
        {is_admin ? "Admin" : "Member"}
      </Tag>
    ),
  },
  {
    title: "",
    align: "center",
    render: (item, record) => (
      <UserMenuButton
        user_id={record.user_id}
        user_name={record.user_name}
        is_admin={record.sysadmin}
      />
    ),
  },
];

export default columns;

// {/*<BanUserModal user_id={record.id} />*/}
