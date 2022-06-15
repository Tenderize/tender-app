import { calculateAPY } from "../src/calculateAPY";
import { TenderizerDaysType } from "../src/queries/types";

describe("calculateAPY", () => {
  test("including negative and 0 values", () => {
    const valami = calculateAPY(input);
    expect(valami.graph.apy).toBe("42.41");
  });
});

const input: TenderizerDaysType = {
  tenderizerDays: [
    {
      id: "19135_Graph",
      date: 1653264000,
      DPY: "0.002362316612103990970995878214103326",
      __typename: "TenderizerDay",
    },
    {
      id: "19136_Graph",
      date: 1653350400,
      DPY: "0.0002669180241362374373923833558642517",
      __typename: "TenderizerDay",
    },
    { id: "19138_Graph", date: 1653523200, DPY: "0", __typename: "TenderizerDay" },
    { id: "19140_Graph", date: 1653696000, DPY: "0", __typename: "TenderizerDay" },
    {
      id: "19145_Graph",
      date: 1654128000,
      DPY: "0.001057361263608797745685566694130758",
      __typename: "TenderizerDay",
    },
    { id: "19146_Graph", date: 1654214400, DPY: "0", __typename: "TenderizerDay" },
    { id: "19149_Graph", date: 1654473600, DPY: "0", __typename: "TenderizerDay" },
    {
      id: "19152_Graph",
      date: 1654732800,
      DPY: "0.01657323190719411464875286167153674",
      __typename: "TenderizerDay",
    },
    {
      id: "19153_Graph",
      date: 1654819200,
      DPY: "-0.0000000000000000000000036146936843184780912586539958911247",
      __typename: "TenderizerDay",
    },
    {
      id: "19154_Graph",
      date: 1654905600,
      DPY: "0.0000919523397068126459955026176633706",
      __typename: "TenderizerDay",
    },
    { id: "19155_Graph", date: 1654992000, DPY: "0", __typename: "TenderizerDay" },
  ],
};
