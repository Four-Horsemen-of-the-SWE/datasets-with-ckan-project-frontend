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
  getItem(
    "Datasets",
    "datasets",
    null,
    [
      getItem("All Datasets", "all-datasets", <DatabaseOutlined />),
      getItem("Option3", "option3"),
    ],
    "group",
  ),
  getItem(
    "Users",
    "users",
    null,
    [
      getItem("All Users", "all-users", <UserOutlined />),
      getItem("Option4", "option4"),
    ],
    "group"
  ),
  getItem(
    "Articles",
    "articles",
    null,
    [
      getItem("All Articles", "all-articles", <FileTextOutlined />),
      getItem("Option5", "option5"),
    ],
    "group"
  ),
];

export default siderItems;
