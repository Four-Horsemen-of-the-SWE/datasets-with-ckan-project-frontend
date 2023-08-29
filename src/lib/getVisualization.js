import React, { useState, useEffect } from "react";
import {
  AutoSizer,
  Table,
  Column,
} from "react-virtualized";
import "react-virtualized/styles.css";
import {
  Image,
  Tabs,
  Select,
  Typography,
  Card,
  Space,
  Button,
  InputNumber,
  Result,
  Grid,
  Row,
  Col,
} from "antd";
import {
  FileImageOutlined
} from "@ant-design/icons";
import Papa from "papaparse";
import mime from "mime";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { saveAs } from "file-saver";
import { Bar, Line, Scatter } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import "hammerjs";
import randomColor from "randomcolor";
import { useModalSizeStore } from "../store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  zoomPlugin,
  Filler
);

const imageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/tiff",
  "image/webp",
  "image/svg+xml",
  "image/vnd.microsoft.icon",
  "image/jp2",
];

export function getVisualize(mimetype, url) {
  if (imageMimeTypes.includes(mimetype)) {
    return <VisualizeImage url={url} />;
  } else if (mimetype === "text/csv") {
    return (
      <VisualizeCSV
        csvFilePath={
          // "http://127.0.0.1:5000/dataset/fab1f121-733c-4001-bfc7-5d62c3b2d0ef/resource/5b6fbb81-defe-4c7b-8b09-cf3183398b09/download/1e1e_netflix-userbase.csv"
          url
        }
      />
    );
  } else {
    return null;
  }
}

export function VisualizeImage({url}) {
  return (
    <div className="w-full flex items-center justify-center">
      <Image
        src={url}
        fallback={process.env.PUBLIC_URL + "/images/placeholder/image.jpg"}
      />
    </div>
  );
}

export function VisualizeCSV({ csvFilePath }) {
  const [csvData, setCsvData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isMaximize } = useModalSizeStore();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await new Promise((resolve, reject) => {
          Papa.parse(csvFilePath, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
              resolve(result.data);
            },
            error: (error) => {
              reject(error);
            },
          });
        });

        setCsvData(result);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [csvFilePath]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Tabs defaultActiveKey="table" size="large">
      <Tabs.TabPane tab="Table" key="table">
        <div
          style={{
            minHeight: isMaximize ? "60vh" : "40vh",
            width: "100%",
            overflow: "auto",
            marginTop: "0.5em",
          }}
        >
          {csvData?.length !== 0 && (
            <>
              <AutoSizer>
                {({ width, height }) => (
                  <Table
                    width={width}
                    height={height}
                    headerHeight={20}
                    rowHeight={30}
                    rowCount={csvData.length}
                    rowGetter={({ index }) => csvData[index]}
                  >
                    {Object.keys(csvData[0]).map((key, index) => (
                      <Column
                        key={index}
                        label={key}
                        dataKey={key}
                        width={150}
                      />
                    ))}
                  </Table>
                )}
              </AutoSizer>
            </>
          )}
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Graph" key="graph">
        <VisualizeGraph dataset={csvData} />
      </Tabs.TabPane>
    </Tabs>
  );
}

export function VisualizeGraph({ dataset }) {
  const field = Object.keys(dataset[0]).map((item) => ({
    lable: item,
    value: item,
  }));
  const [xAxis, setXAxis] = useState([]);
  const [selectedSeries, setSelectedSerie] = useState([]);
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const [dataRange, setDataRange] = useState({ min: 0, max: 20 });
  const [selectedXAxis, setSelectedXAxis] = useState(new Set());
  const { isMaximize } = useModalSizeStore();

  const colorScheme = [
    "#5588BB",
    "#66BBBB",
    "#AA6644",
    "#99BB55",
    "#EE9944",
    "#444466",
    "#BB5555",
    "#F0EE00",
  ];

  const chartData = {
    labels: xAxis,
    datasets: data?.map((item, key) => {
      return {
        label: selectedSeries[key],
        data: item,
        borderWidth: 1.2,
        borderColor: colorScheme[key],
        backgroundColor: colorScheme[key]
      };
    }),
  };

  const options = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
    scales: {
      x: {
        ticks: {
          stepSize: 50,
          autoSkip: true,
          maxTicksLimit: 8,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 50,
          autoSkip: true,
          maxTicksLimit: 5,
        },
      },
    },
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          mode: "x",
          speed: 100,
          // drag: {
          //   enabled: true,
          // },
        },
        pan: {
          enabled: true,
          mode: "x",
          speed: 0.5,
        },
      },
    },
  };

  const handleXSelected = (value) => {
    setSelectedXAxis(value);
    setXAxis(
      dataset.slice(dataRange.min, dataRange.max).map((item) => item[value])
    );
  };

  const handleSerieSelected = (value) => {
    setSelectedSerie(value);

    // Filter the dataset to include only items from index 100 to 200
    const filteredDataset = dataset.slice(dataRange.min, dataRange.max);

    // Create an array of series data based on the selected values
    const serie_data = value?.map((item) => {
      return filteredDataset.map((i) => i[item]);
    });

    setData(serie_data);
  };

  const handleSave = () => {
    const canvasSave = document.getElementById("chart_canvas");
    canvasSave.toBlob(function (blob) {
      saveAs(blob, "testing.png");
    });
  };

  const content = () => {
    if (chartType === "bar") {
      return <Bar id="chart_canvas" data={chartData} options={options} />;
    } else if (chartType === "line") {
      return <Line id="chart_canvas" data={chartData} options={options} />;
    } else if (chartType === "scatter") {
      return <Scatter id="chart_canvas" data={chartData} options={options} />;
    } else {
      return <div className="flex items-center justify-center h-64 font-semibold text-2xl uppercase text-gray-500">Please selecte chart type</div>
    }
  };

  useEffect(() => {
    const filteredDataset = dataset.slice(dataRange.min, dataRange.max);
    const serie_data = selectedSeries?.map((item) => {
      return filteredDataset.map((i) => i[item]);
    });

    setData(serie_data);

    setXAxis(
      dataset
        .slice(dataRange.min, dataRange.max)
        .map((item) => item[selectedXAxis])
    );
  }, [dataRange]);

  return (
    <div
      className="flex flex-row gap-2 w-full items-center justify-between"
      style={{ height: isMaximize ? "100%" : "auto" }}
    >
      <Row gutter={[18, 18]} style={{ width: "100%"}}>
        <Col sm={16}>
          <div
            className="w-full h-full"
          >
            {content()}
          </div>
        </Col>
        <Col sm={8}>
          <div className="flex flex-col w-full">
            <div className="w-full mb-3">
              <Typography.Text>Graph Type</Typography.Text>
              <Select
                size="large"
                className="block mt-2 w-full"
                placeholder="Line, Bar and Scatter"
                options={[
                  { label: "Bar", value: "bar" },
                  { label: "Line", value: "line" },
                  { label: "Scatter", value: "scatter" },
                ]}
                defaultValue={"bar"}
                onChange={(e) => setChartType(e)}
              />
            </div>
            <div className="w-full mb-3">
              <Typography.Text>Group Column (X Axis)</Typography.Text>
              <Select
                size="large"
                className="block mt-2 w-full"
                placeholder="..."
                options={field}
                onChange={handleXSelected}
              />
            </div>
            <div className="w-full mb-3">
              <Typography.Text>Series</Typography.Text>
              <Select
                size="large"
                mode="multiple"
                className="block mt-2 w-full"
                placeholder="..."
                options={field}
                onChange={handleSerieSelected}
              />
            </div>
            <div className="w-full mb-3">
              <Typography.Text className="block">Data Range</Typography.Text>
              <div className="flex items-center justify-between gap-2">
                <InputNumber
                  size="large"
                  min={0}
                  max={dataRange.max}
                  defaultValue={dataRange.min}
                  className="w-full"
                  placeholder="min"
                  onChange={(e) => setDataRange({ min: e, max: dataRange.max })}
                />
                <InputNumber
                  size="large"
                  min={dataRange.min}
                  max={dataset.length}
                  defaultValue={dataRange.max}
                  className="w-full"
                  placeholder="max"
                  onChange={(e) => setDataRange({ min: dataRange.min, max: e })}
                />
              </div>
            </div>
            <Button
              type="ghost"
              size="large"
              icon={<FileImageOutlined />}
              onClick={handleSave}
              block={true}
              className="bg-black text-white"
            >
              Download as image
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}