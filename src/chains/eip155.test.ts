import { describe, it, expect } from "vitest";
import { eip155 } from "./eip155";
import type { SIWxMessage } from "../types";

describe("EIP-155 Adapter", () => {
  // Test private key for testing only (DO NOT USE IN PRODUCTION)
  // This is the first account from the default Hardhat/Anvil mnemonic
  const testPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  // Corresponding address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

  const testMessage: SIWxMessage = {
    domain: "example.com",
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    uri: "https://example.com/login",
    version: "1",
    chainId: "eip155:1",
    nonce: "32891757",
    issuedAt: "2021-09-30T16:25:24.000Z",
    statement: "Sign in with Ethereum",
  };

  it("should have correct namespace", () => {
    expect(eip155.namespace).toBe("eip155");
  });

  it("should return correct signature type", () => {
    expect(eip155.getSignatureType()).toBe("eip191");
  });

  it("should format message with 'Ethereum account' text", () => {
    const formatted = eip155.formatMessage(testMessage);
    expect(formatted).toContain("wants you to sign in with your Ethereum account:");
    expect(formatted).toContain("Chain ID: 1");
  });

  it("should extract chain ID number from CAIP-2 format", () => {
    const formatted = eip155.formatMessage(testMessage);
    expect(formatted).toContain("Chain ID: 1");
    expect(formatted).not.toContain("Chain ID: eip155:1");
  });

  it("should sign a message and return signature", async () => {
    const result = await eip155.signMessage(testMessage, testPrivateKey);

    expect(result).toHaveProperty("message");
    expect(result).toHaveProperty("signature");
    expect(result).toHaveProperty("signatureType");
    expect(result.signatureType).toBe("eip191");
    expect(result.signature).toMatch(/^0x[0-9a-f]+$/i);
  });

  it("should verify a valid signature", async () => {
    const result = await eip155.signMessage(testMessage, testPrivateKey);
    const isValid = await eip155.verifySignature({
      message: testMessage,
      signature: result.signature,
    });

    expect(isValid).toBe(true);
  });

  it("should reject an invalid signature", async () => {
    const invalidSignature = "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

    const isValid = await eip155.verifySignature({
      message: testMessage,
      signature: invalidSignature,
    });

    expect(isValid).toBe(false);
  });

  it("should reject signature from different address", async () => {
    const result = await eip155.signMessage(testMessage, testPrivateKey);

    const differentMessage: SIWxMessage = {
      ...testMessage,
      address: "0x0000000000000000000000000000000000000000",
    };

    const isValid = await eip155.verifySignature({
      message: differentMessage,
      signature: result.signature,
    });

    expect(isValid).toBe(false);
  });

  it("should handle different chain IDs with correct names", async () => {
    const polygonMessage: SIWxMessage = {
      ...testMessage,
      chainId: "eip155:137",
    };

    const formatted = eip155.formatMessage(polygonMessage);
    expect(formatted).toContain("Polygon account");
    expect(formatted).toContain("Chain ID: 137");
  });

  it("should use chain-specific names for known chains", () => {
    const testCases = [
      { chainId: "eip155:1", expected: "Ethereum account" },
      { chainId: "eip155:137", expected: "Polygon account" },
      { chainId: "eip155:10", expected: "Optimism account" },
      { chainId: "eip155:42161", expected: "Arbitrum One account" },
      { chainId: "eip155:8453", expected: "Base account" },
    ];

    testCases.forEach(({ chainId, expected }) => {
      const msg: SIWxMessage = { ...testMessage, chainId: chainId as any };
      const formatted = eip155.formatMessage(msg);
      expect(formatted).toContain(expected);
    });
  });

  it("should use 'EVM account' for unknown chains", () => {
    const unknownChainMessage: SIWxMessage = {
      ...testMessage,
      chainId: "eip155:99999",
    };

    const formatted = eip155.formatMessage(unknownChainMessage);
    expect(formatted).toContain("EVM account");
  });
});
