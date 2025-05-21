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
