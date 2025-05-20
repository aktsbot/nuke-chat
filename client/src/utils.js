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
