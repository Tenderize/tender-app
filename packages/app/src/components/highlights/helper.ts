import stakers from "../../data/stakers";

export type ScreenSize = "xsmall" | "small" | "medium" | "large" | "xlarge";

export const screenToFontSize = (screenSize: ScreenSize) => {
  switch (screenSize) {
    case "xlarge": {
      return "medium";
    }
    case "large": {
      return "small";
    }
    case "medium": {
      return "small";
    }
    case "small": {
      return "small";
    }
    case "xsmall": {
      return "small";
    }
  }
};

export const stakersWithAPY = Object.values(stakers).map((staker) => {
  let apyInPoints = 0;
  if (data != null) {
    const dpyData = Array.from(data.tenderizerDays)
      .filter((item) => item.id.includes(staker.subgraphId))
      .slice(0, -1);

    if (dpyData.length === 0) {
      apyInPoints = 0;
    } else {
      const dayStart = parseInt(dpyData[0].id.split("_")[0]);
      const dayEnd = parseInt(dpyData[dpyData.length - 1].id.split("_")[0]);
      const daysElapsed = dayEnd - dayStart + 1;

      const sumDPYInPoints = dpyData.reduce((seedValue, item) => seedValue + parseFloat(item.DPY), 0);

      const yearlyAvarageRate = (sumDPYInPoints / daysElapsed) * 365;
      apyInPoints = Math.pow(1 + yearlyAvarageRate / 365, 365) - 1;
    }
  }
  let apy = (apyInPoints * 100).toFixed(2);
  if (staker.path === "/stakers/graph") {
    apy = "39.74";
  }
  return {
    ...staker,
    apy,
  };
});
