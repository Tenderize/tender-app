import { Box, Button, Form, FormField, TextInput } from "grommet";
import { FC, useState } from "react";

export const Subscribe: FC = () => {
  const [value, setValue] = useState({});
  return (
    <Box
      align="center"
      style={{
        paddingTop: 50,
        backgroundImage: "url('/landing/noise.png')",
        backgroundRepeat: "repeat",
      }}
    >
      <Form
        value={value}
        onChange={(nextValue) => setValue(nextValue)}
        onReset={() => setValue({})}
        //   onSubmit={({ value }) => {}}
      >
        <FormField name="name" htmlFor="text-input-id" label="Get the latest news">
          <Box flex direction="row" align="center" width="large">
            <TextInput
              id="text-input-id"
              name="name"
              placeholder="john.doe@example.com"
              style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, padding: 15 }}
            ></TextInput>
            <Button
              type="submit"
              primary
              label="Subscribe"
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            />
          </Box>
        </FormField>
        {/* <Box direction="row" gap="medium"></Box> */}
      </Form>
    </Box>
  );
};
