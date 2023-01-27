import { Box, Text, Tip } from "grommet";
import { FC } from "react";

export const TxWarning: FC<{ errorInfo: string | undefined; errorMessage: string | undefined }> = ({
  errorMessage,
  errorInfo,
}) => {
  return (
    <>
      {errorMessage != null && (
        <Box justify="center" align="center" direction="row" gap="small" pad={{ horizontal: "xsmall" }}>
          <Text color="red">{errorMessage}</Text>
          <Tip
            plain
            dropProps={{
              round: {
                size: "20px",
              },
              background: "rgba(0,0,0,0.7)",
              elevation: "none",
            }}
            content={
              <Box width="medium" elevation="none" pad="medium">
                <Text>{errorInfo}</Text>
              </Box>
            }
          >
            <span
              style={{
                border: "1px solid red",
                borderRadius: "50%",
                paddingLeft: "5px",
                paddingRight: "5px",
                color: "red",
              }}
            >
              &#8505;
            </span>
          </Tip>
        </Box>
      )}
    </>
  );
};
