import { useEffect, useState } from "react";
import { DatabaseOutlined, UserOutlined, FileTextOutlined } from "@ant-design/icons";
import { useAuthUser, useIsAuthenticated } from "react-auth-kit";
import { redirect, Link, useNavigate, useParams } from "react-router-dom";
import { Layout, Menu } from "antd";

// import components
import siderItems from "./siderItems";
import AllDatasetsPage from "./Page/AllDatasetsPage";
import AllUsersPage from "./Page/AllUsersPage";
import SystemAdminPage from "./Page/SystemAdminPage";
import Notfound from "../../components/Notfound";

export default function Dashboard() {
  const auth = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const [selectedMenu, setSelectedMenu] = useState("all_datasets");

  const navigate = useNavigate();
  const { "*": specificPath } = useParams();

  const handleMenuClick = (menu_key) => {
    setSelectedMenu(menu_key);
    navigate(`/dashboard/${menu_key}`);
  }

  const renderContent = () => {
    switch(selectedMenu) {
      case "all_datasets":
        return <AllDatasetsPage />
      case "all_users":
        return <AllUsersPage />
      case "system_admin":
        return <SystemAdminPage />
      default:
        return <Notfound />;
    }
  }

  useEffect(() => {
    // if user is not admin.
    if (!isAuthenticated()) {
      return (window.location.href = "/login")
    }
    if (!auth()?.is_admin) {
      return (window.location.href = "/");
    }
  }, []);

  useEffect(() => {
    if(specificPath) {
      setSelectedMenu(specificPath);
    }
  }, []);

  if (isAuthenticated()) {
    return (
      <Layout>
        <Layout style={{ height: "100% !important" }}>
          <Layout.Sider width={300}>
            <Menu
              mode="inline"
              defaultSelectedKeys={["all_datasets"]}
              style={{ height: "100%", borderRight: 0 }}
              items={siderItems}
              onClick={({ key }) => handleMenuClick(key)}
            />
          </Layout.Sider>
          <Layout style={{ padding: "0 24px 24px" }}>
            <Layout.Content style={{ padding: 24, margin: 0, height: "auto" }}>
              {renderContent()}
            </Layout.Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}