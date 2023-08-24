import {
  DatabaseOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

function getItem(label, key, icon, children, type, onClick) {
  return {
    key,
    icon,
    children,
    label,
    type,
    onClick,
  };
}

const siderItems = [
  getItem("All Datasets", "all_datasets", <DatabaseOutlined />),
  getItem("All Users", "all_users", <UserOutlined />),
  getItem("All Articles", "all_articles", <FileTextOutlined />)
];

export default siderItems;

/*
  getItem(
    "Articles",
    "articles",
    null,
    [
      getItem("All Articles", "all_articles", <FileTextOutlined />),
      getItem("Option5", "option5"),
    ],
    "group"
  ),
*/