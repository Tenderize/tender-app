import { Queries } from "@tender/shared/src";
import { ProtocolName } from "@tender/shared/src/data/stakers";
import { minutesBetweenDates, blockTimestampToDate } from "../formatting";
import { Lock } from "./types";

export const getUnlockDateForProtocol = (
  protocolName: ProtocolName,
  lock: Lock,
  lastProcessUnstakesEvent: Queries.ProcessUnstakesEvent | undefined,
  testDate?: Date
): string => {
  if (lock.open) {
    return "Ready";
  }

  const now = testDate ?? new Date();
  switch (protocolName) {
    case "graph": {
      if (lastProcessUnstakesEvent != null) {
        const minutesSinceProcessUnstake = minutesBetweenDates(
          blockTimestampToDate(lastProcessUnstakesEvent.timestamp),
          now
        );
        let remainingMinutes = 0;
        if (lastProcessUnstakesEvent == null || lock.timestamp < lastProcessUnstakesEvent.timestamp) {
          remainingMinutes = 28 * 24 * 60 - minutesSinceProcessUnstake;
        } else {
          remainingMinutes = 28 * 24 * 60 + 28 * 24 * 60 - minutesSinceProcessUnstake;
        }
        return getTimeRemainingLabel(remainingMinutes);
      } else {
        return "Loading...";
      }
    }
    // case "audius": {
    //   const unstakeDate = blockTimestampToDate(lock.timestamp);
    //   const unlockDate = new Date(unstakeDate);
    //   unlockDate.setDate(unstakeDate.getDate() + 7);
    //   const minutesUntilUnlock = minutesBetweenDates(now, unlockDate);
    //   return getTimeRemainingLabel(minutesUntilUnlock);
    // }
    // case "livepeer": {
    //   const unstakeDate = blockTimestampToDate(lock.timestamp);
    //   const unlockDate = new Date(unstakeDate);
    //   unlockDate.setDate(unstakeDate.getDate() + 7);
    //   const minutesUntilUnlock = minutesBetweenDates(now, unlockDate);
    //   return getTimeRemainingLabel(minutesUntilUnlock);
    // }
    // case "matic": {
    //   const unstakeDate = blockTimestampToDate(lock.timestamp);
    //   const unlockDate = new Date(unstakeDate);
    //   unlockDate.setDate(unstakeDate.getDate() + 2);
    //   const minutesUntilUnlock = minutesBetweenDates(now, unlockDate);
    //   return getTimeRemainingLabel(minutesUntilUnlock);
    // }
  }
};

const getTimeRemainingLabel = (remainingMinutes: number) => {
  if (remainingMinutes < 0) {
    return `Ready`;
  } else if (remainingMinutes < 60) {
    const minutes = remainingMinutes === 0 ? 1 : remainingMinutes;
    return `~ ${minutes} minute${minutes === 1 ? "" : "s"}`;
  } else if (remainingMinutes < 24 * 60) {
    const hours = Math.floor(remainingMinutes / 60);
    return `~ ${hours} hour${hours === 1 ? "" : "s"}`;
  } else {
    const days = Math.floor(remainingMinutes / (60 * 24));
    return `~ ${days} day${days === 1 ? "" : "s"}`;
  }
};
