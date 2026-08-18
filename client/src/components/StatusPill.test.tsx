import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CONTENT_STATUSES } from "../../../shared/contentConfig";
import { StatusPill } from "./StatusPill";

describe("StatusPill", () => {
  it("renders every required post status label", () => {
    CONTENT_STATUSES.forEach((status) => {
      const markup = renderToStaticMarkup(<StatusPill status={status} />);
      expect(markup).toContain(status);
    });
  });
});
