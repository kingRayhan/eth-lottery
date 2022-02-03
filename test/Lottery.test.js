const Web3 = require("web3");
const provider = new Web3.providers.HttpProvider("http://localhost:7545");
const web3 = new Web3(provider);
const compiler = require("simple-solc");
const { expect, it } = require("@jest/globals");

let ownerId;
let players;

beforeEach(async () => {
  const accounts = await web3.eth.getAccounts();
  ownerId = accounts[0];
  players = accounts.slice(1);

  const { bytecode, abi } = await compiler(
    "Lottery",
    "./contracts/Lottery.sol"
  );

  contract = await new web3.eth.Contract(abi)
    .deploy({
      data: bytecode,
    })
    .send({ from: ownerId, gas: "1000000" });
});

describe("Lottery", () => {
  it("Should deploy Lottery contact", async () => {
    expect(contract.options.address).toBeDefined();
  });

  it("has valid owner", async () => {
    expect(await contract.methods.owner().call()).toBe(ownerId);
  });

  it("has valid number of players", async () => {
    expect(await contract.methods.numberOfPlayers().call()).toBe("0");
  });

  it("should join one player", async () => {
    await contract.methods
      .join()
      .send({ from: players[0], value: web3.utils.toWei("1.5", "ether") });

    expect(await contract.methods.numberOfPlayers().call()).toBe("1");
  });

  it("should join multiple players", async () => {
    await contract.methods
      .join()
      .send({ from: players[0], value: web3.utils.toWei("1.5", "ether") });

    await contract.methods
      .join()
      .send({ from: players[1], value: web3.utils.toWei("1.5", "ether") });

    await contract.methods
      .join()
      .send({ from: players[2], value: web3.utils.toWei("1.5", "ether") });

    expect(await contract.methods.numberOfPlayers().call()).toBe("3");
  });

  it("requires a minumum amount of ether to join", async () => {
    await expect(
      contract.methods.join().send({ from: players[0] })
    ).rejects.toThrow("revert");

    await expect(
      contract.methods.join().send({ from: players[0], value: 100 })
    ).rejects.toThrow();
  });

  it("should allow to join if user put minimum amount of ether", async () => {
    await expect(
      contract.methods
        .join()
        .send({ from: players[0], value: web3.utils.toWei("1.5", "ether") })
    ).resolves.not.toThrow();
  });
});
