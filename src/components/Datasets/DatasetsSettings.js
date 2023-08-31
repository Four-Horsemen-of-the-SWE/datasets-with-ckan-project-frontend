import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Typography,
  Upload,
  Image,
  message,
  Space,
  Modal,
} from "antd";
import ImgCrop from "antd-img-crop";
import { useAuthHeader } from "react-auth-kit";
import axios, { all } from "axios";
import ChangeVisibilityModal from "./ChangeVisibilityModal";

const { Title, Text } = Typography;

const visibility_data = [
  {
    value: true,
    label: "Private",
  },
  {
    value: false,
    label: "Public",
  },
];

export default function DatasetsSettings({ datasets }) {
  const [isSaving, setIsSaving] = useState(false);
  const [thumbnail, setThumbnail] = useState(datasets?.thumbnail);
  const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
  const [isChangeVisibilityModalShow, setIsChangeVisibilityModalShow] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const authHeader = useAuthHeader();

  // licenses and tags
  const [allLicenses, setAllLicenses] = useState([]);
  const [allTags, setAllTags] = useState([]);

  const [defailed_form] = Form.useForm();

  const props = {
    headers: {
      Authorization: authHeader().split(" ")[1],
    },
    action: `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/${datasets.id}/thumbnail`,
    name: "thumbnail_image",
    onChange(info) {
      if (info.file.status !== "uploading") {
        message.info(`${info.file.name} uploading`);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG files!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must be smaller than 2MB!");
      }
      return isJpgOrPng && isLt2M;
    },
  };

  // get licenses from backend
  const fetchLicenses = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/licenses`
      );
      if (response.data.ok) {
        setAllLicenses(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // get tags from backend
  const fetchTags = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/tags`
      );
      if (response.status === 200) {
        setAllTags(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validName = (name) => {
    const valid_name = name
      .replace(/[.!]/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .trim()
      .toLowerCase();
    const sanitized_name = valid_name.replace(/[^a-z0-9-_]/g, "");
    return sanitized_name;
  };

  const updateDataset = async (values) => {
    setIsSaving(true);
    const tag_list = values?.tags.map((item) => ({
      name: item.toLowerCase().replaceAll(" ", "-"),
    }));
    values.id = datasets.id;
    values.tags = tag_list;
    values.name = validName(values.title);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/${datasets.id}`,
        values,
        {
          headers: {
            Authorization: authHeader().split(" ")[1],
          },
        }
      );

      if (response.data.ok) {
        message.success("Update Success");
        setIsSaving(false);
        setTimeout(() => {
          // window.location.href = `/datasets/${response.data.result.id}/settings`;
          window.location.reload();
        }, 700);
      }
    } catch (error) {
      message.error(error.message);
      setIsSaving(false);
    }
  };

  const deleteDataset = async () => {
    setIsDeleting(true);
    if (datasets.name === confirmName) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/${datasets.id}`,
          {
            headers: {
              Authorization: authHeader().split(" ")[1],
            },
          }
        );

        if (response.data.ok) {
          messageApi.open({
            type: "success",
            content: "Delete success.",
          });
          setTimeout(() => {
            setIsDeleting(false);
            window.location.href = "/datasets";
          }, 700);
        } else {
          setIsDeleting(false);
        }

        // setIsDeleting(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      messageApi.open({
        type: "warning",
        content: "Dataset name not match.",
      });
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
    fetchTags();
  }, []);

  return (
    <>
      {contextHolder}
      <Modal
        title="Delete this datasets ?"
        open={isDeleteModalShow}
        onCancel={() => setIsDeleteModalShow(false)}
        footer={[
          <Button onClick={() => setIsDeleteModalShow(false)}>Cancel</Button>,
          <Button
            type="primary"
            onClick={() => deleteDataset()}
            loading={isDeleting}
            danger={true}
          >
            Delete
          </Button>,
        ]}
      >
        <Text>
          Confirm the name of datasets to continue. This will permanently delete
          the {datasets.name}
        </Text>
        <Space direction="vertical" className="w-full mb-2">
          <Title level={5}>Dataset name</Title>
          <Input
            size="large"
            placeholder={datasets.name}
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            block
          />
        </Space>
      </Modal>

      <ChangeVisibilityModal
        dataset_id={datasets.id}
        is_private={datasets.private}
        open={isChangeVisibilityModalShow}
        close={() => setIsChangeVisibilityModalShow(false)}
      />

      <div className="container mx-auto">
        <Title level={3}>Settings</Title>

        <Title level={4}>General</Title>

        <Form
          layout="vertical"
          form={defailed_form}
          initialValues={{
            title: datasets.title,
            url: datasets?.url,
            notes: datasets.notes,
            private: datasets.private,
            tags: datasets.tags.map((item) => item.name),
            license_id: datasets?.license_id,
            version: datasets?.version,
          }}
          onFinish={updateDataset}
        >
          <Form.Item label="Name" name="title">
            <Input
              showCount
              maxLength={100}
              placeholder="The name of the new dataset"
              size="large"
            />
          </Form.Item>

          <Form.Item label="URL" name="url">
            <Input size="large" placeholder="A URL for the dataset’s source" />
          </Form.Item>

          <Form.Item label="Description" name="notes">
            <Input.TextArea rows={4} placeholder="Description" />
          </Form.Item>

          <Form.Item label="Others">
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item label="Tags" name="tags">
                  <Select
                    mode="tags"
                    placeholder="Tags"
                    size="large"
                    options={allTags.map((item) => ({
                      label: item.display_name,
                      value: item.name,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="License" name="license_id">
                  <Select
                    placeholder="Licenses"
                    size="large"
                    options={allLicenses.map((item) => ({
                      value: item.id,
                      label: item.title,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Version" name="version">
                  <Input size="large" placeholder="1.0.0" />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={isSaving}
              disabled={isSaving}
              block
            >
              Save
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        <Form layout="vertical">
          <Title level={4}>Thumbnail</Title>
          <Form.Item name="thumbnail">
            <Row gutter={20} align="middle">
              <Col>
                <Image height={70} src={thumbnail} className="rounded-lg" />
              </Col>
              <Col>
                <Typography.Title level={5} style={{ marginTop: 0 }}>
                  Change Thumbnail Image
                </Typography.Title>
                <ImgCrop>
                  <Upload
                    {...props}
                    accept="image/png, image/jpeg"
                    directory={false}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>Upload New Image</Button>
                  </Upload>
                </ImgCrop>
              </Col>
            </Row>
          </Form.Item>
        </Form>

        <Divider />

        {/* DANGER ZONE */}
        <div className="w-full mb-12 flex flex-col gap-y-2.5">
          <Title level={4}>Danger Zone</Title>

          {/* change visibility */}
          <div className="flex justify-between items-center">
            <div>
              <Title level={5} style={{ marginTop: "1.2em" }}>
                Change Visibility
              </Title>
              <Text>
                This dataset is currently{" "}
                {datasets.private ? "Private" : "Public"}.
              </Text>
            </div>
            <Button
              type="primary"
              size="large"
              danger={true}
              onClick={() => setIsChangeVisibilityModalShow(true)}
            >
              Change to {datasets.private ? "Public" : "Private"}
            </Button>
          </div>

          {/* delte dataset */}
          <div className="flex justify-between items-center">
            <div>
              <Title level={5} style={{ marginTop: "1.2em" }}>
                Delete this Dataset
              </Title>
              <Text>
                Once you delete a dataset, there is no going back. Please be
                certain.
              </Text>
            </div>
            <Button
              type="primary"
              size="large"
              danger={true}
              onClick={() => setIsDeleteModalShow(true)}
            >
              Delete this dataset
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

/*
<ImgCrop>
  <Upload
    customRequest={handleUpload}
    accept="image/png, image/jpeg"
    directory={false}
    maxCount={1}
  >
    <Button icon={<UploadOutlined />}>Upload New Image</Button>
  </Upload>
</ImgCrop>
*/
