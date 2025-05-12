import http from "k6/http";
import { check, sleep } from "k6";
import { Trend } from "k6/metrics";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

const BASE_URL = "http://localhost:8000/api/books";
const responseTime = new Trend("response_time");
const createdIds = [];

export const options = {
  thresholds: {
    // 95% requestów poniżej 1s
    http_req_duration: ["p(95)<1000"],
    // mniej niż 1% requestów może failować
    http_req_failed: ["rate<0.01"],
    // co najmniej 99% checków przechodzi
    checks: ["rate>0.99"],
  },
  scenarios: {
    steady_load: {
      executor: "constant-arrival-rate",
      rate: 300,
      timeUnit: "1s",
      duration: "2m",
      preAllocatedVUs: 310,
      maxVUs: 320,
    },
  },
};

function randomTitle() {
  return "Test Book " + Math.random().toString(36).substring(7);
}

export default function () {
  let res;
  const roll = Math.random();

  if (roll < 0.4) {
    res = http.get(BASE_URL);
    check(res, { "GET status is 200": (r) => r.status === 200 });
  } else if (roll < 0.7) {
    const payload = JSON.stringify({
      title: randomTitle(),
      author_id: 1,
      year: 2023,
      genre_id: 1,
    });
    res = http.post(BASE_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });
    check(res, { "POST status is 201": (r) => r.status === 201 });
    if (res.status === 201 && res.json().id) {
      createdIds.push(res.json().id);
    }
  } else if (roll < 0.9) {
    if (createdIds.length) {
      const id = createdIds[Math.floor(Math.random() * createdIds.length)];
      const payload = JSON.stringify({
        id,
        title: "Updated " + randomTitle(),
        author_id: 1,
        year: 2024,
        genre_id: 1,
      });
      res = http.put(BASE_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });
      check(res, { "PUT status is 200": (r) => r.status === 200 });
    }
  } else {
    if (createdIds.length) {
      const id = createdIds.pop();
      res = http.del(BASE_URL, JSON.stringify({ id }), {
        headers: { "Content-Type": "application/json" },
      });
      check(res, { "DELETE status is 200": (r) => r.status === 200 });
    }
  }

  if (res) {
    responseTime.add(res.timings.duration);
  }

  sleep(1);
}

export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
