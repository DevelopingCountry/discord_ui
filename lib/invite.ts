export async function inviteToServer(serverId: string, friendId: string, token: string) {
  try {
    const response = await fetch(`http://localhost:8080/server/${serverId}/invite`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ guestId: friendId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "서버 초대에 실패했습니다.");
    }
    const newVar = await response.json();
    console.log("서버 초대 성공:", newVar);
    return newVar;
  } catch (error) {
    console.error("Failed to invite friend to server:", error);
    throw error;
  }
}
