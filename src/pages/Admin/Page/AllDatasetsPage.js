import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic, Typography } from "antd";
import AllDatasetsTable from "../../../components/Admin/AllDataset/AllDatasetsTable";
import SearchDatasetInput from "../../../components/Admin/AllDataset/SearchDatasetInput";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

export default function AllDatasetsPage() {
  const [numberOfAllDatasets, setNumberOfAllDatasets] = useState(0);
  const fetchNumberOfAllDatasets = async() => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/number_all`);
      if(response.data.ok) {
        setNumberOfAllDatasets(response.data.result);
      }
    } catch(error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchNumberOfAllDatasets();
  }, []);

  return (
    <>
      <Typography.Title>Datasets</Typography.Title>
      <Typography.Paragraph>
        An easy to use UI to help administrators manage and see datasets
        information.
      </Typography.Paragraph>

      <Card bordered={false} className="mb-5">
        <Statistic
          title="All Datasets"
          value={numberOfAllDatasets}
          precision={0}
          valueStyle={{
            color: "#3f8600",
          }}
        />
      </Card>

      <SearchDatasetInput />

      <AllDatasetsTable />
    </>
  );
}
