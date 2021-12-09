import { Grommet } from "grommet";
import { CSSProperties, FC } from "react";
import { theme } from "../theme";

export const GrommetWrapper: FC<{ style: CSSProperties }> = ({ children, style }) => {
  return (
    <Grommet
      themeMode="dark"
      full={true}
      style={{
        background: "url('/background.svg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        ...style,
      }}
      theme={theme}
    >
      {children}
    </Grommet>
  );
};
