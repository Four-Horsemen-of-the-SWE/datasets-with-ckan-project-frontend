import { useEffect, useState } from "react";
import { DatabaseOutlined, UserOutlined, FileTextOutlined } from "@ant-design/icons";
import { useAuthUser, useAuthHeader } from "react-auth-kit";
import { redirect, Link } from "react-router-dom";
import { Layout, Menu } from "antd";

// import components
import siderItems from "./siderItems";
import AllDatasetsPage from "./Page/AllDatasetsPage";
import AllUsersPage from "./Page/AllUsersPage";

export default function Dashboard() {
  const auth = useAuthUser();
  const [selectedMenu, setSelectedMenu] = useState("all_datasets");

  const handleMenuClick = (menu_key) => {
    setSelectedMenu(menu_key);
  }

  const renderContent = () => {
    switch(selectedMenu) {
      case "all_datasets":
        return <AllDatasetsPage />
      case "all_users":
        return <AllUsersPage />
      default:
        return null;
    }
  }

  useEffect(() => {
    // if user is not admin.
    if (!auth()?.is_admin) {
      window.location.href = "/";
    }
  }, []);

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