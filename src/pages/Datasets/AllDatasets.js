import { useEffect, useState } from "react";
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
  message,
  Card,
  Tag,
  AutoComplete,
} from "antd";
import axios from "axios";

// import components
import DatasetsCard from "../../components/Card/DatasetsCard";

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
  const [searchName, setSearchName] = useState("");
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [allDatasets, setAllDatasets] = useState([]);
  // tags
  const [allTags, setAllTags] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const [messageApi, contextHolder] = message.useMessage();

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
    let params = new URLSearchParams(location.search);

    // Check if the incoming key and value already exist in the selectedFilter
    const filterIndex = selectedFilter.findIndex(
      (selectedItem) => selectedItem[key] === item
    );

    if (filterIndex === -1) {
      // If not in the list, add it to the selectedItems and update the URL
      setSelectedFilter([...selectedFilter, { [key]: item }]);
      params.append(key, item);
    } else {
      // If already in the list, remove it from the selectedItems and the URL
      setSelectedFilter(
        selectedFilter.filter((selectedItem) => selectedItem[key] !== item)
      );

      // Manually remove all occurrences of the specified key-value pair from the URL
      const updatedParams = new URLSearchParams();
      for (const [paramKey, paramValue] of params.entries()) {
        if (paramKey === key && paramValue === item) {
          // Skip the key-value pair to remove it
          continue;
        }
        updatedParams.append(paramKey, paramValue);
      }
      // Update the params with the updated values
      params = updatedParams;
    }

    // Update the current params and navigate to the new URL
    navigate({ search: "?" + params.toString() });
  };

  const handleClearFilter = () => {
    // clear all selected items
    setSelectedFilter([]);

    // then set new path
    window.history.replaceState(null, "", `/datasets?q=${searchName}`);
  }

  const handleSearch = async (name) => {
    setSearchName(name);
    // update the query param in URL
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("q", name);
    navigate({ search: queryParams.toString() });

    // search from api
    try {
      const tag_list = selectedFilter.map((item) =>`${Object.keys(item)}=${encodeURIComponent(Object.values(item))}`).join("&");
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/search?q=${name}&${tag_list}`
      );
      if (response.data.ok) {
        setAllDatasets(response.data.result);
      }
      console.log(response.data)
    } catch (error) {
      messageApi.error("Searcing Error...");
    }
  }

  useEffect(() => {
    fetchDatasets();
    fetchTags();
  }, []);

  return (
    <>
      {contextHolder}
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
                onChange={(e) => handleSearch(e.target.value)}
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
              <Button block={true} danger={true} onClick={() => handleClearFilter()}>
                Clear
              </Button>
            </Card>
          </Col>
          {/* show all datasets in database (ckan) */}
          <Col xs={24} lg={18}>
            <div className="container mx-auto mb-4 -mt-2 flex justify-between items-center">
              <div>Datasets {6}</div>
              <div>
                {selectedFilter.map((item) => (
                  <Tag closable>{Object.values(item)}</Tag>
                ))}
              </div>
            </div>
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
