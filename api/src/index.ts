import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import express, { Express, Response, Request } from "express";
import { v4 as randomId } from "uuid";
import { validateProofs } from "./utils";
import cors from "cors";
import { Reclaim } from "@reclaimprotocol/reclaim-sdk/dist/ReclaimProtocol";
import { reclaimprotocol } from "@reclaimprotocol/reclaim-sdk";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const reclaim = new reclaimprotocol.Reclaim();
const RECLAIM_APP_URL = "https://share.reclaimprotocol.org";
const prisma = new PrismaClient();

enum SubmissionStatus {
  pending = "pending",
  completed = "completed",
}
process.on("uncaughtException", function (err) {
  console.log("UNCAUGHT EXCEPTION:\t", err);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

// {
//   "template": {
//       "id": "d25e8d25-113d-44ad-95de-4ed564b997a0",
//       "sessionId": "a200df85-69e7-49dc-9553-32fb33202c9a",
//       "name": "Insta username verify",
//       "callbackUrl": "http://localhost:8000/callback?callbackId=a200df85-69e7-49dc-9553-32fb33202c9a",
//       "claims": [
//           {
//               "templateClaimId": "200d8ce0-6b4b-4713-88c7-71cd6a00539d",
//               "provider": "instagram-user",
//               "payload": {},
//               "context": "{\"contextAddress\":\"0x0\",\"contextMessage\":\"0x8c4d800f6352c3397266359128a21aca34a8d6ff9c2edd9208c3b1cfe5548b54\",\"sessionId\":\"a200df85-69e7-49dc-9553-32fb33202c9a\"}"
//           }
//       ]
//   },
//   "message": "success"
// }

app.get("/init", async (req: Request, res: Response) => {
  try {
    const request = reclaim.requestProofs({
      title: "Insta username verify", // Name of your application
      baseCallbackUrl: "https://top-charts-backend.onrender.com/callback",
      contextMessage: "Instagram username ", //optional
      requestedProofs: [
        new reclaim.CustomProvider({
          provider: "instagram-user",
          payload: {},
        }),
      ],
    });

    const reclaimUrl = await request.getReclaimUrl({ shortened: true });

    await prisma.submissions.create({
      data: {
        sessionId: request.template.id,
        reclaimUrl,
      },
    });

    res.status(200).send({
      template: request.template,
      message: "success",
    });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong",
      error: JSON.stringify(error),
    });
  }
});

app.get("/status/:id", async (req: Request, res: Response) => {
  const templateFoundInDB = await prisma.submissions.findFirst({
    where: {
      sessionId: req.params.id,
    },
  });

  if (!templateFoundInDB) {
    res.status(400).send({
      message: "Invalid sessionId",
    });
    return;
  }

  res.send({
    template: templateFoundInDB,
  });
});

app.post("/submit/:id", async (req: Request, res: Response) => {
  const proof = req.body.proof;

  if (!proof) {
    res.status(400).send({
      message: "Invalid proof",
    });
    return;
  }

  const isProofValid = await reclaim.verifyCorrectnessOfProofs("", proof);

  if (!isProofValid) {
    res.status(400).send({
      message: "Invalid proof",
    });
    return;
  }

  await prisma.submissions.findFirstOrThrow({
    where: {
      sessionId: req.params.id,
    },
  });

  await prisma.submissions.update({
    where: {
      sessionId: req.params.id,
    },
    data: {
      proof,
    },
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://192.168.68.104:${port}`);
});
