import Logo from "../images/folders.svg";
import { useCreateModalStore } from "../store";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useIsAuthenticated, useAuthUser} from "react-auth-kit";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Typography, Space } from "antd";
import { Link } from "react-router-dom";

// import component
import DrawerView from "./DrawerView";
import CreateDatasetsModal from "./Datasets/CreateDatasetsModal";
import NotificationPopover from "./Popover/NotificationPopover";

export default function Navbar() {
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(useIsAuthenticated());
  const { isCreateModalShow, setIsCreateModalShow } = useCreateModalStore()
  const user = useAuthUser();
  const isAdmin = user() && user()?.is_admin;

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

      {/* navbar */}
      <Card bordered size="small" className="w-full shadow-md rounded-lg">
        <div className="container mx-auto flex flex-row justify-between items-center">
          <div className="flex items-center">
            <Link to="/">
              <img
                src={Logo}
                alt="logo"
                width={50}
                height={50}
                className="m-0 p-0 hidden sm:block"
              />
            </Link>
            <Link
              to="/"
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
              to="/datasets"
              className="ml-2 sm:ml-4"
              style={{ color: "#000", textTransform: "uppercase" }}
            >
              Datasets
            </Link>

            {/* Render the admin-specific links */}
            {isAdmin && (
              <>
                <Link
                  to="/dashboard"
                  className="ml-2 sm:ml-4"
                  style={{ color: "#000", textTransform: "uppercase" }}
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center sm:mt-0">
            <div className="flex sm:mt-0 ml-2 sm:ml-4 items-center">
              {isLogin ? (
                <>
                  <Space>
                    {!isAdmin && (
                      <Button
                        icon={<PlusOutlined />}
                        onClick={() => setIsCreateModalShow(true)}
                      >
                        Create Datasets
                      </Button>
                    )}
                    <NotificationPopover />
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
                  <Link to="/login">
                    <Button className="mr-2 sm:mr-4">Login</Button>
                  </Link>
                  <Link to="/register">
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
