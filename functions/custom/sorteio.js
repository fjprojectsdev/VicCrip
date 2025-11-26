```export async function handleSorteio(sock, message, text) {
  const chatId = message.key.remoteJid;
  const args = text.split(' ').slice(1);
  const numeroSorteado = Math.floor(Math.random() * 15) + 1;
  await sock.sendMessage(chatId, { text: `O número sorteado é: ${numeroSorteado}` });
}```