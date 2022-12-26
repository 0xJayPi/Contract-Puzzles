const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");
const { Signer } = require("ethers");
const { ethers } = require("hardhat");

describe("Game5", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();

    return { game };
  }
  it("should be a winner", async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);
    const [signer] = await ethers.getSigners(0);
    let wallet;

    while (true) {
      wallet = ethers.Wallet.createRandom().connect(ethers.provider);
      if (wallet.address < 0x00ffffffffffffffffffffffffffffffffffffff) {
        break;
      }
    }

    console.log(`Address found, ${wallet.address}`);
    const to = wallet.address;
    const value = ethers.utils.parseEther("1");

    // wallet has no funds to pay for gas
    await signer.sendTransaction({ to, value });
    await game.connect(wallet).win();

    assert(await game.isWon(), "You did not win the game");
  });
});
