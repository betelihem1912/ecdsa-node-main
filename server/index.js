const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "0474a16b061c8b4e25ff5f246161bcbdebe9b01fb0b4e88f4e11b61ccc942fc2c716160182818cf57c395405bd38ed019d1261746c62a3a2159a2cbb1c287dc15d": 100, //dan
  "040b0281f71ff021148a001988debbb30d3958f72cf5df51cbeaeed1b158b034361f4c321ef5e8272b05d1d5f2fc8f30b1a9ae7563d277671049a5d310346918cc": 50, //ali
  "04bfd1c7ec43a4a1664b20f06aa91191c30aeda48fd3360ea194c6f8b539e996f5017f183d7d74573fe756d757b5786b5252554154ba8413c285f21ade8b5df06e": 75, //ben
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signature, hexMessage, recoveryBit, sender, recipient, amount } =
    req.body;

  const signaturePublicKey = secp.recoverPublicKey(
    hexMessage,
    signature,
    recoveryBit
  );
  const signatureAddressNotHex = keccak256(signaturePublicKey.slice(1)).slice(
    -20
  );
  const signatureAddress = toHex(signatureAddressNotHex);
  console.log(signatureAddress);
  console.log(recipient);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  // check the signature address and the typed sender address
  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else if (signatureAddress !== recipient) {
    res.status(400).send({ message: "You are not the person!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
