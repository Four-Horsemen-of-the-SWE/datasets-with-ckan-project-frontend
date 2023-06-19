import {
  UserOutlined,
  DatabaseOutlined,
  BookOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useSignOut } from "react-auth-kit";
import { Button, Drawer, List, Space, Popconfirm, Typography } from "antd"

const { Link } = Typography

export default function DrawerView({ isDrawerOpen, close }) {
  const signOut = useSignOut();

  const signOutHandle = () => {
    signOut();
    window.location.href = "/";
  };

  const data = [
    {
      icon: <UserOutlined />,
      label: (
        <Link href="/profile/me" style={{ color: "#000" }}>
          Your Profile
        </Link>
      ),
    },
    {
      icon: <DatabaseOutlined />,
      label: "Your Datasets",
    },
    {
      icon: <BookOutlined />,
      label: "Your Bookmarked",
    },
    {
      icon: <EditOutlined />,
      label: "Edit Profile",
    },
    {
      icon: (
        <Popconfirm
          title="Logout ?"
          description="Are you sure to logout ?"
          placement="right"
          onConfirm={signOutHandle}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger>
            Logout
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Drawer
      title="Profile"
      placement="right"
      open={isDrawerOpen}
      onClose={close}
    >
      <List
        size="middle"
        dataSource={data}
        renderItem={(item) => <List.Item>
          <Space size={16}>
            {item.icon}
            {item.label}
          </Space>
        </List.Item>}
      />
    </Drawer>
  );
}