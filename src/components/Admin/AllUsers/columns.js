import { Link } from "react-router-dom";
import { Button, Image, Space, Tag } from "antd";
import { formatted_date_relative_hour } from "../../../lib/formatted_date";
import BanUserModal from "./BanUserModal";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text, record) => (
      <Space>
        <Image
          src={
            record.image_display_url
              ? record.image_display_url
              : process.env.PUBLIC_URL + "/images/no_avatar.png"
          }
          width={50}
          height={50}
          className="rounded-md"
        />
        <Link to={`/profile/${text}`}>{text}</Link>
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
    title: "Ban",
    align: "center",
    render: (item, record) => (
      <BanUserModal user_id={record.id} />
    )
  }
];

export default columns;
