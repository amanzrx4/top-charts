import {
  Proof,
  SubmittedProof,
  reclaimprotocol,
} from "@reclaimprotocol/reclaim-sdk";

const INVALID_PROOF = "Invalid proof";

export const validateProofs = async (obj: unknown) => {
  let isValid = false;
  const { verifyCorrectnessOfProofs } = new reclaimprotocol.Reclaim();

  try {
    const proofsObj = isProofObject(
      JSON.parse(decodeURIComponent(JSON.stringify(obj)))
    )
      ? (obj as SubmittedProof[])
      : null;

    console.log("proof obj", proofsObj);

    if (proofsObj) {
      let isValid = false;

      // @ts-ignore
      isValid = await verifyCorrectnessOfProofs("", proofsObj);
      console.log("is valid", isValid);

      return isValid;
    }
  } catch (error) {
    console.log("error", error);
    isValid = false;
  }
  return isValid;
};

const isProofObject = (obj: unknown): obj is Proof[] => {
  if (!Array.isArray(obj)) {
    return false;
  }

  return true;
};
