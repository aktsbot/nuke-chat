export const getLocationParts = () => {
  // https://domain.com/r800#k9089#akts
  const roomId = location.pathname.split("/").join(""); //r800
  const hash = location.hash; // #k9089#akts

  const [encKey, username] = hash.split("#").filter((h) => h); // ['k9089', 'akts']

  return {
    roomId,
    encKey,
    username,
  };
};

// https://stackoverflow.com/questions/66846314/anyone-know-how-to-encrypt-something-into-xor-with-a-key-in-javascript
export const encrypt = ({ message, encKey }) => {
  let result = "";
  for (let i = 0; i < message.length; i++) {
    result += String.fromCharCode(
      message.charCodeAt(i) ^ encKey.charCodeAt(i % encKey.length)
    );
  }
  return result;
};

export const decrypt = ({ message, encKey }) => {
  return encrypt({ message, encKey });
};

export const saveToStorage = ({ key, data }) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getFromStorage = ({ key }) => {
  let data = [];
  try {
    const _data = localStorage.getItem(key);
    data = JSON.parse(_data);
  } catch (error) {
    console.error("error in storage load");
    console.error(error);
  }
  return data;
};

export const nuke = () => {
  localStorage.clear();
  location.href = "/";
};

export const buildMessageList = ({
  myUsername,
  newMessages,
  existingMessages,
  encKey,
}) => {
  const result = [...existingMessages];
  for (const m of newMessages) {
    if (!result.find((r) => r.id === m.id)) {
      let decryptedMessage = "";
      if (m.type === "message") {
        decryptedMessage = decrypt({
          message: m.message,
          encKey,
        });
      }
      result.push({
        ...m,
        isFromMe: myUsername === m.username,
        decryptedMessage,
      });
    }
  }
  // sort by date
  result.sort((a, b) => {
    let c = new Date(a.date);
    let d = new Date(b.date);
    return c.getTime() - d.getTime();
  });
  return result;
};
