import { useEffect, useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input, Button, Typography, message } from "antd";
import { useSignIn, useIsAuthenticated } from "react-auth-kit";
import axios from "axios";
import Logo from "../images/folders.svg";

const { Title, Text, Link } = Typography;

export default function Login() {
  document.title = "Login";
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isProcess, setIsProcess] = useState(false);

  const signIn = useSignIn();
  const isLogin = useIsAuthenticated();

  const onFinishFailed = (errorInfo) => {
    messageApi.error(JSON.stringify(errorInfo));
    setIsProcess(false);
  };

  const signInHandle = async (value) => {
    try {
      setIsProcess(true);
      const response = await axios.post(`${process.env.REACT_APP_CKAN_API_ENDPOINT}/users/login`, {
        username: value.username,
        password: value.password,
        expiresIn: 60000,
      });

      // if use response.status === 200. it will error
      if (response.data.ok) {
        if (
          signIn({
            token: response.data.accessToken,
            expiresIn: response.data.expiresIn,
            tokenType: "Bearer",
            authState: response.data.user,
          })
        ) {
          // if success
          messageApi.success("Login Success");
          setTimeout(() => {
            window.location.href = '/';
            setIsProcess(false);
          }, 1200);
        } else {
          // if error
          messageApi.error("Login Error");
          setIsProcess(false);
        }
      } else {
        // if error
        messageApi.error(response.data.message);
        setIsProcess(false);
      }
    } catch (error) {
      // show error message
      messageApi.error('Network Error');
    }
  };

  useEffect(() => {
    if (isLogin()) {
      window.location.href = "/";
    }
  }, []);

  return (
    <div className="container mx-auto flex-1 justify-center items-center h-screen gap-10 lg:flex">
      {contextHolder}
      <div className="flex flex-col items-center w-full lg:w-1/3">
        <div className="flex items-center justify-center mb-5">
          <img src={Logo} alt="logo" width={50} height={50} className="mr-2" />
          <Title level={4} className="m-0 p-0">
            DATASETS HUB
          </Title>
        </div>
        <Text type="secondary" strong className="mb-4">
          Login to upload your datasets and share them for everyone to use.
        </Text>

        <Form
          name="login"
          form={form}
          layout="vertical"
          onFinish={signInHandle}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="w-full"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
            getValueFromEvent={(event) =>
              event.target.value.replace(/\s+/g, "-").toLowerCase()
            }
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              type="password"
              size="large"
            />
          </Form.Item>
          <Form.Item shouldUpdate>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                disabled={
                  !form.isFieldsTouched(true) ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length)
                    .length
                }
                className="mt-4"
                loading={isProcess}
              >
                Login
              </Button>
            )}
          </Form.Item>

          <div className="flex justify-between items-center font-semibold mt-4">
            <span>Or create an account.</span>
            <Link href="/register">Register</Link>
          </div>
        </Form>
      </div>

      <img
        src={process.env.PUBLIC_URL + "/images/login.svg"}
        alt="login"
        className="h-32 md:h-64 hidden lg:block"
      />
    </div>
  );
}
