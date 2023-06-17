import {
  LockOutlined,
  UserOutlined,
  ProfileOutlined,
  CameraOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Form, Input, Button, Typography, message, Divider, Upload } from "antd";

const { Title, Text, Link } = Typography;

export default function Register() {
  document.title = "Register";
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (value) => {
    messageApi.success("Login Success");
  };

  const onFinishFailed = (errorInfo) => {
    messageApi.error(JSON.stringify(errorInfo));
  };

  return (
    <div className="container mx-auto flex-1 justify-center items-center h-screen gap-10 lg:flex">
      {contextHolder}
      <img
        src={process.env.PUBLIC_URL + "/images/team.svg"}
        alt="register"
        className="h-32 md:h-64 hidden lg:block"
      />
      <Form
        name="login"
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="w-full lg:w-1/3"
      >
        <div className="mb-5">
          <Title>Register</Title>
          <Text type="secondary" strong>
            Register to visit the best dataset repository.
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
          name="fullname"
          rules={[
            {
              required: true,
              message: "Please input your fullname!",
            },
          ]}
        >
          <Input
            prefix={<ProfileOutlined />}
            placeholder="Fullname"
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
        <Form.Item name="imageurl">
          <Input
            prefix={<CameraOutlined />}
            placeholder="Image URL"
            size="large"
          />
        </Form.Item>

        <Divider plain>OR</Divider>

        <Form.Item>
          <Upload listType="picture">
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item shouldUpdate>
          {() => (
            <Button type="primary" htmlType="submit" size="large" block>
              Register
            </Button>
          )}
        </Form.Item>

        <div className="flex justify-between items-center font-semibold">
          <span>Already have an account ?</span>
          <Link href="/login">Login</Link>
        </div>
      </Form>
    </div>
  );
}
