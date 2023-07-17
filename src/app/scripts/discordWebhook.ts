const MY_ID: string = "567665494518267904"

function sendWebhook(content: string, successMessage: string, url: string) {
  const payload = {
    username: "Exam Help Bot",
    content: `<@${MY_ID}>\n` + content,
  };

  fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }
  ).then(() => {
    alert(successMessage);
  }).catch(error => {
    alert("Message failed to send! Feel free to email me at bence@mudkip.live");
    console.error(error);
  });
}

export default sendWebhook;
