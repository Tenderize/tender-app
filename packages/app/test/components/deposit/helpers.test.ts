import { ProcessUnstakesEvent } from "@tender/shared/src/queries";
import { getUnlockDateForProtocol } from "../../../src/components/deposit/helpers";
import { Lock } from "../../../src/components/deposit/types";

const SEC = 1000;
const MINUTE = 60 * SEC;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

describe("audius unlock labels", () => {
  test("open audius lock should be Ready", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: true,
    };
    const label = getUnlockDateForProtocol("audius", lock, undefined, now);

    expect(label).toBe("Ready");
  });

  test("new audius lock should be 7 days", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };
    const label = getUnlockDateForProtocol("audius", lock, undefined, now);

    expect(label).toBe("~ 7 days");
  });

  test("25 hour old audius lock should be 5 days", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    now.setTime(now.getTime() + 25 * HOUR);
    const label = getUnlockDateForProtocol("audius", lock, undefined, now);

    expect(label).toBe("~ 5 days");
  });

  test("6 days old audius lock should be 1 day", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    now.setTime(now.getTime() + 6 * DAY);
    const label = getUnlockDateForProtocol("audius", lock, undefined, now);

    expect(label).toBe("~ 1 day");
  });

  test("6 days and 1 hour old audius lock should be 23 hours", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    now.setTime(now.getTime() + 6 * DAY + HOUR);
    const label = getUnlockDateForProtocol("audius", lock, undefined, now);

    expect(label).toBe("~ 23 hours");
  });

  test("6 days and 23 hours old audius lock should be 1 hours", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    now.setTime(now.getTime() + 6 * DAY + 23 * HOUR);
    const label = getUnlockDateForProtocol("audius", lock, undefined, now);

    expect(label).toBe("~ 1 hour");
  });

  test("6 days 23 hours and 20 minutes old audius lock should be 40 minutes", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    now.setTime(now.getTime() + 6 * DAY + 23 * HOUR + 20 * MINUTE);
    const label = getUnlockDateForProtocol("audius", lock, undefined, now);

    expect(label).toBe("~ 40 minutes");
  });

  test("7 days old audius lock should be 1 minute", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    now.setTime(now.getTime() + 7 * DAY);
    const label = getUnlockDateForProtocol("audius", lock, undefined, now);

    expect(label).toBe("~ 1 minute");
  });

  test("7 days and 1 second old audius lock should be Ready", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    now.setTime(now.getTime() + 7 * DAY + SEC);
    const label = getUnlockDateForProtocol("audius", lock, undefined, now);

    expect(label).toBe("Ready");
  });
  test("20 days old audius lock should be Ready", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    now.setTime(now.getTime() + 20 * DAY);
    const label = getUnlockDateForProtocol("audius", lock, undefined, now);

    expect(label).toBe("Ready");
  });
});

describe("livepeer unlock labels", () => {
  test("open livepeer lock should be Ready", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: true,
    };
    const label = getUnlockDateForProtocol("livepeer", lock, undefined, now);

    expect(label).toBe("Ready");
  });

  test("new livepeer lock should be 7 days", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };
    const label = getUnlockDateForProtocol("livepeer", lock, undefined, now);

    expect(label).toBe("~ 7 days");
  });

  test("25 hour old livepeer lock should be 5 days", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    now.setTime(now.getTime() + 25 * HOUR);
    const label = getUnlockDateForProtocol("livepeer", lock, undefined, now);

    expect(label).toBe("~ 5 days");
  });

  test("6 days old livepeer lock should be 1 day", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    now.setTime(now.getTime() + 6 * DAY);
    const label = getUnlockDateForProtocol("livepeer", lock, undefined, now);

    expect(label).toBe("~ 1 day");
  });

  test("6 days and 1 hour old livepeer lock should be 23 hours", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    now.setTime(now.getTime() + 6 * DAY + HOUR);
    const label = getUnlockDateForProtocol("livepeer", lock, undefined, now);

    expect(label).toBe("~ 23 hours");
  });

  test("6 days and 23 hours old livepeer lock should be 1 hours", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    now.setTime(now.getTime() + 6 * DAY + 23 * HOUR);
    const label = getUnlockDateForProtocol("livepeer", lock, undefined, now);

    expect(label).toBe("~ 1 hour");
  });

  test("6 days 23 hours and 20 minutes old livepeer lock should be 40 minutes", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    now.setTime(now.getTime() + 6 * DAY + 23 * HOUR + 20 * MINUTE);
    const label = getUnlockDateForProtocol("livepeer", lock, undefined, now);

    expect(label).toBe("~ 40 minutes");
  });
  test("7 days old livepeer lock should be 1 minute", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    now.setTime(now.getTime() + 7 * DAY);
    const label = getUnlockDateForProtocol("livepeer", lock, undefined, now);

    expect(label).toBe("~ 1 minute");
  });

  test("7 days and 1 second old livepeer lock should be Ready", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    now.setTime(now.getTime() + 7 * DAY + SEC);
    const label = getUnlockDateForProtocol("livepeer", lock, undefined, now);

    expect(label).toBe("Ready");
  });

  test("20 days old livepeer lock should be Ready", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    now.setTime(now.getTime() + 20 * DAY);
    const label = getUnlockDateForProtocol("livepeer", lock, undefined, now);

    expect(label).toBe("Ready");
  });
});

describe("matic unlock labels", () => {
  test("open matic lock should be Ready", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: true,
    };
    const label = getUnlockDateForProtocol("matic", lock, undefined, now);

    expect(label).toBe("Ready");
  });

  test("new matic lock should be 2 days", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };
    const label = getUnlockDateForProtocol("matic", lock, undefined, now);

    expect(label).toBe("~ 2 days");
  });

  test("12 hour old matic lock should be 1 day", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    now.setTime(now.getTime() + 12 * HOUR);
    const label = getUnlockDateForProtocol("matic", lock, undefined, now);

    expect(label).toBe("~ 1 day");
  });

  test("1 day old matic lock should be 1 day", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    now.setTime(now.getTime() + DAY);
    const label = getUnlockDateForProtocol("matic", lock, undefined, now);

    expect(label).toBe("~ 1 day");
  });

  test("1 day and 1 hour old matic lock should be 23 hours", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    now.setTime(now.getTime() + DAY + HOUR);
    const label = getUnlockDateForProtocol("matic", lock, undefined, now);

    expect(label).toBe("~ 23 hours");
  });

  test("1 day and 23 hours old matic lock should be 1 hours", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    now.setTime(now.getTime() + DAY + 23 * HOUR);
    const label = getUnlockDateForProtocol("matic", lock, undefined, now);

    expect(label).toBe("~ 1 hour");
  });

  test("1 days 23 hours and 20 minutes old matic lock should be 40 minutes", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    now.setTime(now.getTime() + DAY + 23 * HOUR + 20 * MINUTE);
    const label = getUnlockDateForProtocol("matic", lock, undefined, now);

    expect(label).toBe("~ 40 minutes");
  });

  test("2 days old matic lock should be 1 minute", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    now.setTime(now.getTime() + 2 * DAY);
    const label = getUnlockDateForProtocol("matic", lock, undefined, now);

    expect(label).toBe("~ 1 minute");
  });

  test("2 days and 1 second old matic lock should be Ready", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    now.setTime(now.getTime() + 2 * DAY + SEC);
    const label = getUnlockDateForProtocol("matic", lock, undefined, now);

    expect(label).toBe("Ready");
  });

  test("20 days old matic lock should be Ready", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    now.setTime(now.getTime() + 20 * DAY);
    const label = getUnlockDateForProtocol("matic", lock, undefined, now);

    expect(label).toBe("Ready");
  });
});

describe("graph unlock labels", () => {
  test("graph without loaded processUnstakeEvents should be Loading...", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };
    const label = getUnlockDateForProtocol("graph", lock, undefined, now);

    expect(label).toBe("Loading...");
  });

  test("open graph lock should be Ready", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: true,
    };
    const label = getUnlockDateForProtocol("graph", lock, undefined, now);

    expect(label).toBe("Ready");
  });

  test("new graph lock with same time processUnstake should be 56 days", () => {
    const now = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };
    const processUnstakeEvents: ProcessUnstakesEvent = {
      from: "",
      node: "",
      tenderizer: "",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
    };
    const label = getUnlockDateForProtocol("graph", lock, processUnstakeEvents, now);

    expect(label).toBe("~ 56 days");
  });

  test("graph lock with new processUnstake should be 28 days", () => {
    const lockTime = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (lockTime.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    const now = new Date("January 17, 2023 09:00:00");
    now.setTime(now.getTime() + DAY);
    const processUnstakeEvents: ProcessUnstakesEvent = {
      from: "",
      node: "",
      tenderizer: "",
      amount: "100",
      timestamp: (now.getTime() / 1000).toString(),
    };
    const label = getUnlockDateForProtocol("graph", lock, processUnstakeEvents, now);

    expect(label).toBe("~ 28 days");
  });

  test("2 day old graph lock with 1 day old processUnstakes should be 27 days", () => {
    const lockTime = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (lockTime.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    const processUnstakesTime = new Date("January 17, 2023 09:00:00");
    processUnstakesTime.setTime(processUnstakesTime.getTime() + DAY);
    const processUnstakeEvents: ProcessUnstakesEvent = {
      from: "",
      node: "",
      tenderizer: "",
      amount: "100",
      timestamp: (processUnstakesTime.getTime() / 1000).toString(),
    };
    const now = new Date("January 17, 2023 09:00:00");
    now.setTime(now.getTime() + 2 * DAY);

    const label = getUnlockDateForProtocol("graph", lock, processUnstakeEvents, now);

    expect(label).toBe("~ 27 days");
  });

  test("5 day old graph lock with 1 day old processUnstakes should be 27 days", () => {
    const lockTime = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (lockTime.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    const processUnstakesTime = new Date("January 17, 2023 08:26:00");
    processUnstakesTime.setTime(processUnstakesTime.getTime() + 4 * DAY);
    const processUnstakeEvents: ProcessUnstakesEvent = {
      from: "",
      node: "",
      tenderizer: "",
      amount: "100",
      timestamp: (processUnstakesTime.getTime() / 1000).toString(),
    };
    const now = new Date("January 17, 2023 08:26:00");
    now.setTime(now.getTime() + 5 * DAY);

    const label = getUnlockDateForProtocol("graph", lock, processUnstakeEvents, now);

    expect(label).toBe("~ 27 days");
  });

  test("29 day old graph lock with 27 day old processUnstakes should be 1 day", () => {
    const lockTime = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (lockTime.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    const processUnstakesTime = new Date("January 17, 2023 09:00:00");
    processUnstakesTime.setTime(processUnstakesTime.getTime() + 2 * DAY);
    const processUnstakeEvents: ProcessUnstakesEvent = {
      from: "",
      node: "",
      tenderizer: "",
      amount: "100",
      timestamp: (processUnstakesTime.getTime() / 1000).toString(),
    };
    const now = new Date("January 17, 2023 09:00:00");
    now.setTime(now.getTime() + 29 * DAY);

    const label = getUnlockDateForProtocol("graph", lock, processUnstakeEvents, now);

    expect(label).toBe("~ 1 day");
  });

  test("29 day old graph lock with 27 day and 1 hour old processUnstakes should be 23 hours", () => {
    const lockTime = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (lockTime.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    const processUnstakesTime = new Date("January 17, 2023 09:00:00");
    processUnstakesTime.setTime(processUnstakesTime.getTime() + 2 * DAY);
    const processUnstakeEvents: ProcessUnstakesEvent = {
      from: "",
      node: "",
      tenderizer: "",
      amount: "100",
      timestamp: (processUnstakesTime.getTime() / 1000).toString(),
    };
    const now = new Date("January 17, 2023 09:00:00");
    now.setTime(now.getTime() + 29 * DAY + 1 * HOUR);

    const label = getUnlockDateForProtocol("graph", lock, processUnstakeEvents, now);

    expect(label).toBe("~ 23 hours");
  });

  test("29 day old graph lock with 27 day and 23 hour old processUnstakes should be 1 hour", () => {
    const lockTime = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (lockTime.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    const processUnstakesTime = new Date("January 17, 2023 09:00:00");
    processUnstakesTime.setTime(processUnstakesTime.getTime() + 2 * DAY);
    const processUnstakeEvents: ProcessUnstakesEvent = {
      from: "",
      node: "",
      tenderizer: "",
      amount: "100",
      timestamp: (processUnstakesTime.getTime() / 1000).toString(),
    };
    const now = new Date("January 17, 2023 09:00:00");
    now.setTime(now.getTime() + 29 * DAY + 23 * HOUR);

    const label = getUnlockDateForProtocol("graph", lock, processUnstakeEvents, now);

    expect(label).toBe("~ 1 hour");
  });

  test("29 day old graph lock with 27 day and 23 hour and 20 minutes old processUnstakes should be 40 minutes", () => {
    const lockTime = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (lockTime.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    const processUnstakesTime = new Date("January 17, 2023 09:00:00");
    processUnstakesTime.setTime(processUnstakesTime.getTime() + 2 * DAY);
    const processUnstakeEvents: ProcessUnstakesEvent = {
      from: "",
      node: "",
      tenderizer: "",
      amount: "100",
      timestamp: (processUnstakesTime.getTime() / 1000).toString(),
    };
    const now = new Date("January 17, 2023 09:00:00");
    now.setTime(now.getTime() + 29 * DAY + 23 * HOUR + 20 * MINUTE);

    const label = getUnlockDateForProtocol("graph", lock, processUnstakeEvents, now);

    expect(label).toBe("~ 40 minutes");
  });

  test("29 day old graph lock with 28 days old processUnstakes should be 1 minute", () => {
    const lockTime = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (lockTime.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    const processUnstakesTime = new Date("January 17, 2023 09:00:00");
    processUnstakesTime.setTime(processUnstakesTime.getTime() + 2 * DAY);
    const processUnstakeEvents: ProcessUnstakesEvent = {
      from: "",
      node: "",
      tenderizer: "",
      amount: "100",
      timestamp: (processUnstakesTime.getTime() / 1000).toString(),
    };
    const now = new Date("January 17, 2023 09:00:00");
    now.setTime(now.getTime() + 30 * DAY);

    const label = getUnlockDateForProtocol("graph", lock, processUnstakeEvents, now);

    expect(label).toBe("~ 1 minute");
  });

  test("29 day old graph lock with 28 days and 1 second old processUnstakes should be Ready", () => {
    const lockTime = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (lockTime.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    const processUnstakesTime = new Date("January 17, 2023 09:00:00");
    processUnstakesTime.setTime(processUnstakesTime.getTime() + 2 * DAY);
    const processUnstakeEvents: ProcessUnstakesEvent = {
      from: "",
      node: "",
      tenderizer: "",
      amount: "100",
      timestamp: (processUnstakesTime.getTime() / 1000).toString(),
    };
    const now = new Date("January 17, 2023 09:00:00");
    now.setTime(now.getTime() + 30 * DAY + SEC);

    const label = getUnlockDateForProtocol("graph", lock, processUnstakeEvents, now);

    expect(label).toBe("Ready");
  });

  test("41 day old graph lock with 40 days old processUnstakes should be Ready", () => {
    const lockTime = new Date("January 17, 2023 09:00:00");
    const lock: Lock = {
      tenderizer: "",
      unstakeLockID: "1",
      amount: "100",
      timestamp: (lockTime.getTime() / 1000).toString(),
      from: "0xTEST",
      open: false,
    };

    const processUnstakesTime = new Date("January 17, 2023 09:00:00");
    processUnstakesTime.setTime(processUnstakesTime.getTime() + DAY);
    const processUnstakeEvents: ProcessUnstakesEvent = {
      from: "",
      node: "",
      tenderizer: "",
      amount: "100",
      timestamp: (processUnstakesTime.getTime() / 1000).toString(),
    };
    const now = new Date("January 17, 2023 09:00:00");
    now.setTime(now.getTime() + 41 * DAY);

    const label = getUnlockDateForProtocol("graph", lock, processUnstakeEvents, now);

    expect(label).toBe("Ready");
  });
});
