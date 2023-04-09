const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = secp.utils.randomPrivateKey();

console.log("private key:", toHex(privateKey));

const publicKey = secp.getPublicKey(privateKey);

console.log("public key:", toHex(publicKey));

// generated keys
/*
const keys = {
    "eca40e24b4ade93101b8fc7e19827c788edbcd3542abaca5245d2becf7cf022e":
      "0474a16b061c8b4e25ff5f246161bcbdebe9b01fb0b4e88f4e11b61ccc942fc2c716160182818cf57c395405bd38ed019d1261746c62a3a2159a2cbb1c287dc15d",
    "04f55a7c7b0f721a3c2abbe96c2866491849bcb5f56c30d4c7e1972bc9cb956f":
      "040b0281f71ff021148a001988debbb30d3958f72cf5df51cbeaeed1b158b034361f4c321ef5e8272b05d1d5f2fc8f30b1a9ae7563d277671049a5d310346918cc",
    "58e435e008bced1f3d8729eb1aa17a1bf51ccfb7aba980f33d208f60a8ddb681":
      "04bfd1c7ec43a4a1664b20f06aa91191c30aeda48fd3360ea194c6f8b539e996f5017f183d7d74573fe756d757b5786b5252554154ba8413c285f21ade8b5df06e",
  };
  */
