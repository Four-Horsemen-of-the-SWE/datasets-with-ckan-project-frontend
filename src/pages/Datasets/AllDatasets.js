import React, { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import {
  Col,
  Input,
  Row,
  Space,
  Typography,
  Select,
  Divider,
  Empty,
  DatePicker,
  Button,
  Checkbox,
  Collapse,
  Card,
  List,
  Tag,
  AutoComplete,
} from "antd";
import axios from "axios";

// import components
import DatasetsCard from "../../components/Card/DatasetsCard";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

const tag_data = [
  "Technology",
  "Programming",
  "Web Development",
  "Software",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Cybersecurity",
  "Cloud Computing",
  "Mobile App Development",
  "IoT (Internet of Things)",
  "Big Data",
  "Blockchain",
  "DevOps",
  "Frontend Development",
  "Backend Development",
];

const license_data = [
  "MIT License",
  "Apache License 2.0",
  "GNU General Public License (GPL)",
  'BSD 3-Clause "New" or "Revised" License',
  "Mozilla Public License (MPL)",
  "GNU Lesser General Public License (LGPL)",
  "Eclipse Public License (EPL)",
  "Creative Commons Licenses",
  "ISC License",
  "Boost Software License",
  "GNU Affero General Public License (AGPL)",
  "GNU General Public License (GPL) v3",
  "Common Development and Distribution License (CDDL)",
  "Artistic License 2.0",
  "WTFPL – Do What the F*ck You Want to Public License",
  "Unlicense",
  "Microsoft Public License (MS-PL)",
  "Eclipse Distribution License (EDL)",
  "Open Software License (OSL)",
  "Dojo Foundation License",
  "Perl License",
  "Python Software Foundation License (PSF)",
  "SIL Open Font License (OFL)",
  "European Union Public License (EUPL)",
  "Apple Public Source License (APSL)",
  "Zend Framework License",
  "Facebook BSD + Patents License",
  "Amazon Software License",
  "Google Open Source Project License",
  "Netflix Software License",
  "MongoDB Server Side Public License (SSPL)",
];

export default function AllDatasets() {
  const selectedTagsRef = useRef([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [allDatasets, setAllDatasets] = useState([]);
  const [allTags, setAllTags] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchDatasets = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets`
      );
      if (response.status === 200) {
        setAllDatasets(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleFilterSelected = (key, item) => {
    // get current params
    const params = new URLSearchParams(location.search);
    // apeend with new params
    params.append(key, item);

    selectedTagsRef.current.push(item);
    // update current params
    navigate({ search: "?" + params.toString() });
  };

  useEffect(() => {
    fetchDatasets();
    fetchTags();
  }, []);

  return (
    <>
      <div className="container mx-auto">
        <Row justify="center" align="bottom" gutter={18}>
          <Col sm={24} md={9}>
            <Space direction="vertical" className="my-3">
              <Title>Our Datasets</Title>
              <Text>
                Browse 10+ open source datasets for your next machine learning
                project. Our list of free datasets keeps growing, so make sure
                you visit it frequently.
              </Text>
            </Space>
          </Col>
          <Col sm={24} md={15}>
            <div className="flex gap-2">
              <Input
                prefix={<SearchOutlined />}
                allowClear
                size="large"
                placeholder="Search datasets"
                style={{ width: "100%" }}
              />
              <Select
                defaultValue="hotest"
                size="large"
                options={[
                  {
                    value: "hotest",
                    label: "Hotest",
                  },
                  {
                    value: "newest",
                    label: "Newest",
                  },
                ]}
              />
            </div>
          </Col>
        </Row>
      </div>

      <Divider />

      <div className="container mx-auto">
        <Row gutter={[18, 18]}>
          {/* show filter options, such asssssss date, tag, license */}
          <Col xs={24} lg={6}>
            <Card>
              <div>Selected Tags: {selectedTagsRef.current.join(", ")}</div>

              {/* Tag Section */}
              <div className="mb-10">
                <Title level={5} style={{ marginTop: 0 }}>
                  Tags
                </Title>
                <AutoComplete
                  placeholder="Search tags here."
                  className="w-full mb-2"
                />
                <div className="overflow-y-auto overflow-x-hidden max-h-56">
                  {tag_data.map((item) => (
                    <div
                      style={{
                        backgroundColor: "#F7F9FC",
                        padding: "4px 10px",
                        marginBottom: "5px",
                        borderRadius: "7px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleFilterSelected("tags", item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* License Section */}
              <div className="mb-10">
                <Title level={5} style={{ marginTop: 0 }}>
                  License
                </Title>
                <AutoComplete
                  placeholder="Search license here."
                  className="w-full mb-2"
                />
                <div className="overflow-y-auto overflow-x-hidden max-h-56">
                  {license_data.map((item) => (
                    <div
                      style={{
                        backgroundColor: "#F7F9FC",
                        padding: "4px 10px",
                        marginBottom: "5px",
                        borderRadius: "7px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleFilterSelected("licenses", item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Date section */}
              <div className="mb-10">
                <Title level={5} style={{ marginTop: 0 }}>
                  Date
                </Title>
                <DatePicker.RangePicker
                  placement="bottomRight"
                  className="w-full"
                />
              </div>

              {/* Clear button */}
              <Button block={true} danger={true}>
                Clear
              </Button>
            </Card>
          </Col>
          {/* show all datasets in database (ckan) */}
          <Col xs={24} lg={18}>
            <Row gutter={[18, 18]}>
              {allDatasets.length ? (
                allDatasets.map((item, key) => (
                  <Col xs={12} md={12} lg={6} key={key}>
                    <DatasetsCard
                      id={item.id}
                      thumbnail={item?.thumbnail}
                      title={item.title}
                      notes={item.notes}
                      metadata_modified={item.metadata_modified}
                      author={item.author}
                    />
                  </Col>
                ))
              ) : (
                <Col
                  span={24}
                  className="w-full h-96 flex items-center justify-center"
                >
                  <Empty />
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}
