import Logo from "../images/folders.svg";
import { useCreateModalStore } from "../store";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useIsAuthenticated } from "react-auth-kit";
import { UserOutlined, PlusOutlined, MessageOutlined } from "@ant-design/icons";
import { Button, Card, Typography, Space } from "antd";

// import component
import DrawerView from "./DrawerView";
import CreateDatasetsModal from "./Datasets/CreateDatasetsModal";

const { Link } = Typography;

export default function Navbar() {
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(useIsAuthenticated());
  const { isCreateModalShow, setIsCreateModalShow } = useCreateModalStore()

  // Check if the current route is the login or register page
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  // Hide the navbar on the login and register pages
  if (isLoginPage || isRegisterPage) {
    return null;
  }

  return (
    <>
      {/* create datasets modal view */}
      <CreateDatasetsModal
        isModalOpen={isCreateModalShow}
        close={() => setIsCreateModalShow(false)}
      />

      {/* drawer view */}
      <DrawerView
        isDrawerOpen={isDrawerOpen}
        close={() => setIsDrawerOpen(false)}
      />

      <Card bordered size="small" className="w-full shadow-md rounded-lg">
        <div className="container mx-auto flex flex-row justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <img
                src={Logo}
                alt="logo"
                width={50}
                height={50}
                className="m-0 p-0 hidden sm:block"
              />
            </Link>
            <Link
              href="/"
              className="ml-2 sm:ml-4"
              style={{
                color: "#1890ff",
                textTransform: "uppercase",
                fontWeight: "bold",
              }}
            >
              DATASETS HUB
            </Link>
            <Link
              href="/datasets"
              className="ml-2 sm:ml-4"
              style={{ color: "#000", textTransform: "uppercase" }}
            >
              Datasets
            </Link>
            <Link
              href="/article"
              className="ml-2 sm:ml-4"
              style={{ color: "#000", textTransform: "uppercase" }}
            >
              Article
            </Link>
          </div>
          <div className="flex items-center sm:mt-0">
            <div className="flex sm:mt-0 ml-2 sm:ml-4 items-center">
              {isLogin ? (
                <>
                  <Space>
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() => setIsCreateModalShow(true)}
                    >
                      Create Datasets
                    </Button>
                    <Button icon={<MessageOutlined />} disabled />
                    <Button
                      icon={<UserOutlined />}
                      onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                    >
                      Profile
                    </Button>
                  </Space>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button className="mr-2 sm:mr-4">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button type="primary">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
