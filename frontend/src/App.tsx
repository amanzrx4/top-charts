import { Button, Flex } from "@mantine/core";
import { useEffect, useState } from "react";
import "./App.css";
// import { QRCodeSVG } from "qrcode.react";
// import Form from "./Form";
// import SubmissionCard from "./Card";

const BASE_URL = import.meta.env.VITE_BACKEND_URL as string;
// enum SubmissionStatus {
//   idle = "idle",
//   pending = "pending",
//   completed = "completed",
// }
function App() {
  // const [sessionId, setSessionId] = useState("");
  // const [templateUrl, setTemplateUrl] = useState("");
  const [data, setData] = useState<{ message: string }[]>([]);
  // const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
  //   SubmissionStatus.idle
  // );

  console.log("data", data);

  const fetchAllSubmissions = async () => {
    return await fetch(BASE_URL + "/whistleblow");
  };

  useEffect(() => {
    fetchAllSubmissions().then((res) => {
      res.json().then((data) => {
        setData(data.data);
      });
    });
  }, []);

  // const onGenerate = async () => {
  //   const res = await fetch((BASE_URL + "/generate") as string, {
  //     method: "POST",
  //   });
  //   const data = (await res.json()) as {
  //     sessionId: string;
  //     templateUrl: string;
  //   };
  //   setSessionId(data.sessionId);
  //   setTemplateUrl(data.templateUrl);
  // };

  // const onFetchSessionData = async (id: string) => {
  //   // /data/:sessionId
  //   const res = await fetch(BASE_URL + "/status/" + id);
  //   const data = (await res.json()) as {
  //     status: SubmissionStatus;
  //     sessionId: string;
  //   };
  //   setSubmissionStatus(data.status);
  // };

  // useEffect(() => {
  //   if (sessionId === "") return;

  //   if (submissionStatus === SubmissionStatus.idle) {
  //     onFetchSessionData(sessionId);
  //     return;
  //   }

  //   if (submissionStatus === SubmissionStatus.completed) return;
  //   setInterval(() => {
  //     console.log("fetching", sessionId);
  //     onFetchSessionData(sessionId);
  //   }, 2000);
  // }, [sessionId, submissionStatus]);

  // if (submissionStatus === SubmissionStatus.completed) {
  //   return <Form sessionId={sessionId} />;
  // }

  return (
    <>
      <div style={{ width: "100%", height: "100%" }}>
        <div className="text-container">
          <h1>TOP CHARTS</h1>
        </div>

        {/* <Text variant="text">TOP CHARTS </Text> */}
        <Flex gap="7px" align="center">
          <input
            type="text"
            style={{
              padding: "20px",
              backgroundColor: "white",
              width: "100%",
              color: "black",
              borderRadius: "10px",
            }}
            placeholder="Enter link to instagram song"
          />
          <Button size="lg" onClick={() => {}}>
            Submit
          </Button>
        </Flex>
      </div>
      {/* {sessionId !== "" ? (
        <div>
          <h3>Session ID: {sessionId}</h3>
          <QRCodeSVG value={templateUrl || ""} />,
          <h2>Status: {submissionStatus.toUpperCase()}</h2>
        </div>
      ) : (
        <div style={{ width: "100%" }}>
          <Button mb={"lg"} variant="outline" onClick={onGenerate}>
            Whistleblow
          </Button>

          <Flex gap={"lg"} direction={"column"}>
            {data.map((item) => {
              return <SubmissionCard message={item.message} />;
            })}
          </Flex>
        </div>
      )} */}
    </>
  );
}

export default App;
