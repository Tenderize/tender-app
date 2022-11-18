import { theme } from "@tender/shared/src";
import { normalizeColor } from "grommet/utils";
import styled from "styled-components";

const brandColor = normalizeColor("brand", theme);
export const BrandedALink = styled.a`
  color: ${brandColor};
`;
