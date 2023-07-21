import {
  UserOutlined,
  DatabaseOutlined,
  BookOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useSignOut, useAuthUser } from "react-auth-kit";
import { Button, Drawer, List, Space, Popconfirm, Typography, Avatar } from "antd"

const { Link } = Typography

const ProfileBox = ({ image_url, username, fullname }) => {
  return (
    <div className="flex items-center justify-start gap-4">
      <Avatar size="large" src={image_url} alt="user profile" />
      <div className="flex flex-col">
        <b>{username}</b>
        <small className="text-slate-600 font-normal">
          {fullname}
        </small>
      </div>
    </div>
  );
}

export default function DrawerView({ isDrawerOpen, close }) {
  const signOut = useSignOut();
  const auth = useAuthUser();

  const signOutHandle = () => {
    signOut();
    window.location.href = "/";
  };

  const data = [
    {
      icon: <UserOutlined />,
      label: (
        <Link href={`/profile/${!!auth()?.name ? auth().name : ''}`} style={{ color: "#000" }}>
          Your Profile
        </Link>
      ),
    },
    {
      icon: <DatabaseOutlined />,
      label: (
        <Link href={`/profile/${!!auth()?.name ? auth().name : ''}/datasets`} style={{ color: "#000" }}>
          Your Datasets
        </Link>
      ),
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
          placement="bottomLeft"
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
      title={<ProfileBox image_url={auth().image_url} username={auth().name}  fullname={auth().fullname} />}
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