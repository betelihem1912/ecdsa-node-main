import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex } from "ethereum-cryptography/utils";
import { utf8ToBytes } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [hexMessage, setHashMessage] = useState("");
  const [recoveryBit, setRecoveryBit] = useState("");
  const [signature, setSignature] = useState("");
  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature,
        recoveryBit,
        hexMessage
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  async function hashAndSign() {
    try {
      const transactionMessage = {
        sender : address,
        amount : parseInt(sendAmount),
        recipient : recipient,
      }
      // hash the transaction 
      const hashedMessage = keccak256(utf8ToBytes(JSON.stringify(transactionMessage)));
      const hexMessage = toHex(hashedMessage);
      setHashMessage(hexMessage);

      //then sign the message with private key
      const [signature, recoveryBit] = await secp.sign(hexMessage, recipient, {recovered: true});
      //const signature = toHex(signatureArray[0]);
      setSignature(toHex(signature));
      //const recoveryBit = signatureArray[1];
      setRecoveryBit(recoveryBit);

    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="button" className="button" value="Sign the transaction" onClick={hashAndSign}></input>
      <div>Your transaction hash: {hexMessage}</div>
      <div>Your signature: {signature.slice(0,4)}...{signature.slice(-4)}</div>
      <div>Your recoveryBit: {recoveryBit}</div>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
