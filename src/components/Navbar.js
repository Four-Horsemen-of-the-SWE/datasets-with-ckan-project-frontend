import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Space, Input, Typography } from "antd";
import Logo from "../images/folders.svg";
import { useLocation } from "react-router-dom";

const { Link } = Typography;
const { Search } = Input;

export default function Navbar() {
  const location = useLocation();

  // Check if the current route is the login or register page
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  // Hide the navbar on the login and register pages
  if (isLoginPage || isRegisterPage) {
    return null;
  }
  return (
    <Card bordered size="small" className="w-full shadow-md rounded-lg">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
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
            href="/datasets"
            className="ml-2 sm:ml-4"
            style={{ color: "#000", textTransform: "uppercase" }}
          >
            Datasets
          </Link>
        </div>
        <div className="flex items-center mt-3 sm:mt-0">
          <div className="flex mt-3 sm:mt-0 ml-2 sm:ml-4">
            <Link href="/login">
              <Button className="mr-2 sm:mr-4">Login</Button>
            </Link>
            <Link href="/register">
              <Button type="primary">Register</Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
