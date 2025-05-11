import http from "k6/http";
import { check, sleep } from "k6";
import { Trend } from "k6/metrics";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

const BASE_URL = "http://localhost:8000/api/books";
const responseTime = new Trend("response_time");

const createdIds = [];

export const options = {
  thresholds: {
    http_req_duration: ["p(95)<5000"],
  },
  scenarios: {
    load_10: {
      executor: "constant-arrival-rate",
      rate: 10,
      timeUnit: "1s",
      duration: "10s",
      preAllocatedVUs: 20,
      maxVUs: 50,
    },
    load_25: {
      executor: "constant-arrival-rate",
      rate: 25,
      timeUnit: "1s",
      duration: "10s",
      preAllocatedVUs: 50,
      maxVUs: 100,
    },
    load_50: {
      executor: "constant-arrival-rate",
      rate: 50,
      timeUnit: "1s",
      duration: "10s",
      preAllocatedVUs: 100,
      maxVUs: 200,
    },
    load_75: {
      executor: "constant-arrival-rate",
      rate: 75,
      timeUnit: "1s",
      duration: "10s",
      preAllocatedVUs: 150,
      maxVUs: 300,
    },
    load_100: {
      executor: "constant-arrival-rate",
      rate: 100,
      timeUnit: "1s",
      duration: "10s",
      preAllocatedVUs: 200,
      maxVUs: 400,
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
    if (res.status === 201) {
      const json = res.json();
      if (json.id) {
        createdIds.push(json.id);
      }
    }
    check(res, { "POST status is 201": (r) => r.status === 201 });
  } else if (roll < 0.9) {
    if (createdIds.length > 0) {
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
    if (createdIds.length > 0) {
      const id = createdIds.pop();
      const payload = JSON.stringify({ id });
      res = http.del(BASE_URL, payload, {
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
