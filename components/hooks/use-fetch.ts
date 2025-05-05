export async function useGetServers(url: string) {
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("서버 생성 실패");
  return res.json();
}

export async function useCreateServer(url: string, data: { serverName: string; imageUrl?: string | null }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("서버 생성 실패");
  return res.json();
}
