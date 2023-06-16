import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input, Button, Typography } from "antd";

const { Title, Text, Link } = Typography;

export default function Login() {
  document.title = "Login";
  const [form] = Form.useForm();

  const onFinish = (value) => {
    console.log(value);
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <img
        src={process.env.PUBLIC_URL + "/images/login.png"}
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
          <span>or create an account</span>
          <Link href="#">Register</Link>
        </div>
      </Form>
    </div>
  );
}
