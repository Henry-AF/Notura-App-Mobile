import assert from "node:assert/strict";
import test from "node:test";

import {
  fetchHomeOverview,
  mapDashboardOverview,
  type DashboardOverviewResponse,
} from "../../app/(tabs)/home-api.ts";

function createDashboardFixture(): DashboardOverviewResponse {
  return {
    userName: "Gabriel",
    plan: "pro",
    meetingsThisMonth: 4,
    monthlyLimit: 30,
    openTaskCount: 1,
    hoursSaved: 3,
    todayCount: 1,
    recentMeetings: [
      {
        id: "meeting-1",
        clientName: "Acme",
        title: "Kickoff",
        createdAt: "2026-04-10T10:00:00.000Z",
        status: "completed",
      },
    ],
    openTasks: [],
  };
}

test("mapDashboardOverview deve manter dados essenciais para a home", () => {
  const mapped = mapDashboardOverview(createDashboardFixture());

  assert.equal(mapped.userName, "Gabriel");
  assert.equal(mapped.plan, "pro");
  assert.equal(mapped.meetingsThisMonth, 4);
  assert.equal(mapped.monthlyLimit, 30);
  assert.equal(mapped.todayCount, 1);
  assert.equal(mapped.recentMeetings.length, 1);
  assert.equal(mapped.recentMeetings[0].status, "completed");
});

test("fetchHomeOverview deve usar o provider e retornar dados mapeados", async () => {
  let called = 0;
  const provider = async () => {
    called += 1;
    return createDashboardFixture();
  };

  const overview = await fetchHomeOverview(provider);
  assert.equal(called, 1);
  assert.equal(overview.recentMeetings[0].title, "Kickoff");
});

