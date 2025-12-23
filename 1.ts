/* Запрос */

enum Status {
  published = "published",
  draft = "draft",
  deleted = "deleted",
}

type GetFaqsRequest = {
  topicId: number;
  status: Status;
};

/* Ответ */
type GetFaqsResponse = [
  {
    question: string;
    answer: string;
    tags: string[];
    likes: number;
    status: Status;
  }
];

async function getFaqs(req: GetFaqsRequest): Promise<GetFaqsResponse> {
  const res = await fetch("/faqs", {
    method: "POST",
    body: JSON.stringify(req),
  });
  const data = await res.json();
  return data;
}
