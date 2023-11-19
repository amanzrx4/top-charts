import { Button, Group, Text, Textarea } from "@mantine/core";
import { useState } from "react";
const BASE_URL = import.meta.env.VITE_BACKEND_URL as string;
interface Props {
  sessionId: string;
}
const Form = ({ sessionId }: Props) => {
  const [input, setInput] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await fetch(BASE_URL + "/data/" + sessionId + "?type=message", {
        method: "POST",
        body: JSON.stringify({
          whistleBlowMessage: input,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log("error form submit", error);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Group position="apart" mb={5}>
        <Text component="label" htmlFor="your-password" size="sm" weight={500}>
          Whistleblow something
        </Text>
      </Group>
      <Textarea
        size="xl"
        style={{ width: "100%" }}
        variant="filled"
        minRows={5}
        required
        value={input}
        onChange={(event) => setInput(event.currentTarget.value)}
        placeholder="Whistleblow something"
        id="whistleblow"
      />

      <Group position="right" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
};

export default Form;
