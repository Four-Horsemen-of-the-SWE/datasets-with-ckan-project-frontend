import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input, Button, Typography, message } from "antd";

const { Title, Text, Link } = Typography;

export default function Login() {
  document.title = "Login";
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage()

  const onFinish = (value) => {
    messageApi.success('Login Success')
  };

  const onFinishFailed = (errorInfo) => {
    messageApi.error(JSON.stringify(errorInfo));
  };

  return (
    <div className="container mx-auto flex-1 justify-center items-center h-screen gap-10 md:flex">
      {contextHolder}
      <img
        src={process.env.PUBLIC_URL + "/images/login.svg"}
        alt="data"
        height={350}
      />
      <Form
        name="login"
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="w-1/3"
      >
        <div className="mb-5">
          <Title>Login</Title>
          <Text type="secondary" strong>
            Login to upload your datasets. and share for everyone to use.
          </Text>
        </div>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
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
            >
              Login
            </Button>
          )}
        </Form.Item>

        <div className="flex justify-between items-center font-semibold">
          <span>Or create an account.</span>
          <Link href="/register">Register</Link>
        </div>
      </Form>
    </div>
  );
}
