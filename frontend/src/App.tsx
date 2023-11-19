/* eslint-disable */
import { Button, Flex, Text as MantineText } from "@mantine/core";
import { useEffect, useState } from "react";
import "./App.css";
import { QRCodeSVG } from "qrcode.react";
// import Form from "./Form";
// import SubmissionCard from "./Card";

const BASE_URL = "https://top-charts-backend.onrender.com";
// enum SubmissionStatus {
//   idle = "idle",
//   pending = "pending",
//   completed = "completed",
// }

type Template = {
  id: string;
  sessionId: string;
  name: string;
  callbackUrl: string;
  proof: string | null;
  reclaimUrl: string;
};

function App() {
  const [template, setTemplate] = useState<Template | null>(null);
  const [modTemplate, setModTemplate] = useState<Template | null>(null);

  useEffect(() => {
    if (template) {
      setInterval(() => {
        checkTemplateStatus(template.sessionId);
      }, 1000);
    }
  }, [template]);

  const checkTemplateStatus = async (id: string) => {
    fetch(BASE_URL + "/status/" + id)
      .then((res) => res.json())
      .then((data) => {
        setModTemplate(data.template);
      });
  };

  //   {
  //     "template": {
  //         "id": "8c0d0a8f-5363-4f05-aa3c-868f0e056392",
  //         "sessionId": "4b23bac9-a0c4-487f-819a-d3e68eb5fb88",
  //         "name": "Insta username verify",
  //         "callbackUrl": "http://localhost:8000/callback?callbackId=4b23bac9-a0c4-487f-819a-d3e68eb5fb88",
  //         "claims": [
  //             {
  //                 "templateClaimId": "e25debcb-e6b6-4123-930c-3f93ca70eac0",
  //                 "provider": "instagram-user",
  //                 "payload": {},
  //                 "context": "{\"contextAddress\":\"0x0\",\"contextMessage\":\"0x8c4d800f6352c3397266359128a21aca34a8d6ff9c2edd9208c3b1cfe5548b54\",\"sessionId\":\"4b23bac9-a0c4-487f-819a-d3e68eb5fb88\"}"
  //             }
  //         ]
  //     },
  //     "message": "success"
  // }
  // const [sessionId, setSessionId] = useState("");
  // const [templateUrl, setTemplateUrl] = useState("");
  // const [data, setData] = useState<{ message: string }[]>([]);
  // const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
  //   SubmissionStatus.idle
  // );

  const onGenerate = async () => {
    const res = await fetch((BASE_URL + "/init") as string);
    const data = (await res.json()).template as Template;
    setTemplate(data);
  };

  return (
    <>
      {modTemplate ? (
        <>
          <h1>{modTemplate.name}</h1>
          {modTemplate.proof ? (
            <>
              <h5>{JSON.stringify(modTemplate.proof)}</h5>
            </>
          ) : (
            <h5>Status pending</h5>
          )}
          <h1>{modTemplate.name}</h1>
          <QRCodeSVG value={modTemplate.reclaimUrl} />
        </>
      ) : (
        <>
          <div style={{ width: "100%", height: "100%" }}>
            <MantineText variant="text">TOP CHARTS </MantineText>
            <Flex gap="7px" align="center">
              <Button size="lg" onClick={onGenerate}>
                Prove your insta username
              </Button>
            </Flex>
          </div>
        </>
      )}
    </>
  );
}

export default App;
