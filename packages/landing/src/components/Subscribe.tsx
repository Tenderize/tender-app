import { Box, Button, FormField, TextInput } from "grommet";
import { ChangeEventHandler, FC, useState } from "react";

export const Subscribe: FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const [value, setValue] = useState({ email: "" });
  const handler: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue({ email: e.target.value });
  };
  return (
    <Box
      key="10"
      align="center"
      style={{
        paddingTop: 50,
        backgroundImage: "url('/landing/noise.png')",
        backgroundRepeat: "repeat",
      }}
    >
      <form action="https://tenderize.us10.list-manage.com/subscribe/post" target="_blank" method="POST" noValidate>
        <input type="hidden" name="u" value="d36254924390324af7102fcbb" />
        <input type="hidden" name="id" value="cbeaeb95ce" />
        <Input onChange={handler} value={value} setValue={setValue} isMobile={isMobile} />
        <div
          style={{ position: "absolute", left: "-5000px" }}
          aria-hidden="true"
          aria-label="Please leave the following three fields empty"
        >
          <label htmlFor="b_name">Name: </label>
          <input type="text" name="b_name" tabIndex={-1} value="" placeholder="Freddie" id="b_name" />

          <label htmlFor="b_email">Email: </label>
          <input type="email" name="b_email" tabIndex={-1} value="" placeholder="youremail@gmail.com" id="b_email" />

          <label htmlFor="b_comment">Comment: </label>
          <textarea name="b_comment" tabIndex={-1} placeholder="Please comment" id="b_comment"></textarea>
        </div>
      </form>
    </Box>
  );
};

const Input: FC<{
  isMobile: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  value: { email: string };
  setValue: (v: { email: string }) => void;
}> = (props) => {
  return props.isMobile ? (
    <FormField name="EMAIL" required htmlFor="email" label="Get the latest news" style={{ alignItems: "center" }}>
      <Box flex direction="column" align="center" justify="center" gap="medium">
        <TextInput
          id="email"
          name="EMAIL"
          placeholder="john.doe@example.com"
          value={props.value.email}
          onChange={props.onChange}
          style={{ padding: 15 }}
        />
        <Button type="submit" id="mc-embedded-subscribe" primary label="Subscribe" name="subscribe" />
      </Box>
    </FormField>
  ) : (
    <FormField name="EMAIL" required htmlFor="email" label="Get the latest news">
      <Box flex direction="row" align="center" width="large">
        <TextInput
          id="email"
          name="EMAIL"
          placeholder="john.doe@example.com"
          value={props.value.email}
          onChange={props.onChange}
          style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, padding: 15 }}
        />
        <Button
          type="submit"
          id="mc-embedded-subscribe"
          primary
          label="Subscribe"
          name="subscribe"
          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        />
      </Box>
    </FormField>
  );
};
