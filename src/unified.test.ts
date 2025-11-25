import { describe, it, expect } from "vitest";
import {
  SIWx,
  createMessage,
  getAdapter,
  getAdapterFromChainId,
  formatMessage,
} from "./unified";
import type { SIWxMessage } from "./types";

describe("Unified API", () => {
  describe("createMessage", () => {
    it("should create a basic message with required fields", () => {
      const message = createMessage({
        domain: "example.com",
        address: "0x1234567890123456789012345678901234567890",
        chainId: "eip155:1",
        uri: "https://example.com/login",
      });

      expect(message.domain).toBe("example.com");
      expect(message.address).toBe("0x1234567890123456789012345678901234567890");
      expect(message.chainId).toBe("eip155:1");
      expect(message.uri).toBe("https://example.com/login");
      expect(message.version).toBe("1");
      expect(message.nonce).toBeDefined();
      expect(message.issuedAt).toBeDefined();
    });

    it("should auto-generate nonce if not provided", () => {
      const message1 = createMessage({
        domain: "example.com",
        address: "0x1234567890123456789012345678901234567890",
        chainId: "eip155:1",
        uri: "https://example.com/login",
      });

      const message2 = createMessage({
        domain: "example.com",
        address: "0x1234567890123456789012345678901234567890",
        chainId: "eip155:1",
        uri: "https://example.com/login",
      });

      expect(message1.nonce).not.toBe(message2.nonce);
    });

    it("should use custom nonce if provided", () => {
      const customNonce = "my-custom-nonce";
      const message = createMessage({
        domain: "example.com",
        address: "0x1234567890123456789012345678901234567890",
        chainId: "eip155:1",
        uri: "https://example.com/login",
        nonce: customNonce,
      });

      expect(message.nonce).toBe(customNonce);
    });

    it("should include optional fields when provided", () => {
      const message = createMessage({
        domain: "example.com",
        address: "0x1234567890123456789012345678901234567890",
        chainId: "eip155:1",
        uri: "https://example.com/login",
        statement: "Sign in to Example.com",
        expirationTime: "2021-09-30T18:25:24.000Z",
        notBefore: "2021-09-30T16:20:24.000Z",
        requestId: "req-123",
        resources: ["https://example.com/resource1"],
      });

      expect(message.statement).toBe("Sign in to Example.com");
      expect(message.expirationTime).toBe("2021-09-30T18:25:24.000Z");
      expect(message.notBefore).toBe("2021-09-30T16:20:24.000Z");
      expect(message.requestId).toBe("req-123");
      expect(message.resources).toEqual(["https://example.com/resource1"]);
    });

    it("should set custom version if provided", () => {
      const message = createMessage({
        domain: "example.com",
        address: "0x1234567890123456789012345678901234567890",
        chainId: "eip155:1",
        uri: "https://example.com/login",
        version: "2",
      });

      expect(message.version).toBe("2");
    });
  });

  describe("getAdapter", () => {
    it("should return EIP-155 adapter for 'eip155' namespace", () => {
      const adapter = getAdapter("eip155");
      expect(adapter.namespace).toBe("eip155");
      expect(adapter.getSignatureType()).toBe("eip191");
    });

    it("should return Solana adapter for 'solana' namespace", () => {
      const adapter = getAdapter("solana");
      expect(adapter.namespace).toBe("solana");
      expect(adapter.getSignatureType()).toBe("solana:ed25519");
    });

    it("should return BIP322 adapter for 'bip322' namespace", () => {
      const adapter = getAdapter("bip322");
      expect(adapter.namespace).toBe("bip322");
      expect(adapter.getSignatureType()).toBe("bip322");
    });

    it("should throw error for unsupported namespace", () => {
      expect(() => getAdapter("unsupported" as any)).toThrow("Unsupported namespace");
    });
  });

  describe("getAdapterFromChainId", () => {
    it("should parse chainId and return correct adapter", () => {
      const ethAdapter = getAdapterFromChainId("eip155:1");
      expect(ethAdapter.namespace).toBe("eip155");

      const solAdapter = getAdapterFromChainId("solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp");
      expect(solAdapter.namespace).toBe("solana");

      const btcAdapter = getAdapterFromChainId("bip322:000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f");
      expect(btcAdapter.namespace).toBe("bip322");
    });
  });

  describe("formatMessage", () => {
    it("should format Ethereum mainnet message correctly", () => {
      const message: SIWxMessage = {
        domain: "example.com",
        address: "0x1234567890123456789012345678901234567890",
        uri: "https://example.com/login",
        version: "1",
        chainId: "eip155:1",
        nonce: "12345",
        issuedAt: "2021-09-30T16:25:24.000Z",
      };

      const formatted = formatMessage(message);
      expect(formatted).toContain("Ethereum account");
      expect(formatted).toContain("Chain ID: 1");
    });

    it("should format Polygon message correctly", () => {
      const message: SIWxMessage = {
        domain: "example.com",
        address: "0x1234567890123456789012345678901234567890",
        uri: "https://example.com/login",
        version: "1",
        chainId: "eip155:137",
        nonce: "12345",
        issuedAt: "2021-09-30T16:25:24.000Z",
      };

      const formatted = formatMessage(message);
      expect(formatted).toContain("Polygon account");
      expect(formatted).toContain("Chain ID: 137");
    });

    it("should format Solana message correctly", () => {
      const message: SIWxMessage = {
        domain: "example.com",
        address: "GwAF45zjfyGzUbd3i3hXxzGeuchzEZXwpRYHZM5912F1",
        uri: "https://example.com/login",
        version: "1",
        chainId: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
        nonce: "12345",
        issuedAt: "2021-09-30T16:25:24.000Z",
      };

      const formatted = formatMessage(message);
      expect(formatted).toContain("Solana account");
    });

    it("should format Bitcoin message correctly", () => {
      const message: SIWxMessage = {
        domain: "example.com",
        address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        uri: "https://example.com/login",
        version: "1",
        chainId: "bip322:000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
        nonce: "12345",
        issuedAt: "2021-09-30T16:25:24.000Z",
      };

      const formatted = formatMessage(message);
      expect(formatted).toContain("Bitcoin account");
    });
  });

  describe("SIWx object", () => {
    it("should expose all required methods", () => {
      expect(SIWx.createMessage).toBeDefined();
      expect(SIWx.signMessage).toBeDefined();
      expect(SIWx.verifySignature).toBeDefined();
      expect(SIWx.formatMessage).toBeDefined();
      expect(SIWx.getAdapter).toBeDefined();
      expect(SIWx.getAdapterFromChainId).toBeDefined();
    });

    it("should create message using SIWx object", () => {
      const message = SIWx.createMessage({
        domain: "example.com",
        address: "0x1234567890123456789012345678901234567890",
        chainId: "eip155:1",
        uri: "https://example.com/login",
      });

      expect(message).toBeDefined();
      expect(message.domain).toBe("example.com");
    });

    it("should format message using SIWx object", () => {
      const message = SIWx.createMessage({
        domain: "example.com",
        address: "0x1234567890123456789012345678901234567890",
        chainId: "eip155:1",
        uri: "https://example.com/login",
      });

      const formatted = SIWx.formatMessage(message);
      expect(formatted).toContain("example.com");
    });
  });

  describe("Integration tests", () => {
    const testPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const testAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

    it("should sign and verify Ethereum message end-to-end", async () => {
      const message = SIWx.createMessage({
        domain: "example.com",
        address: testAddress,
        chainId: "eip155:1",
        uri: "https://example.com/login",
        statement: "Sign in with Ethereum",
      });

      const result = await SIWx.signMessage(message, testPrivateKey);
      expect(result.signature).toBeDefined();

      const isValid = await SIWx.verifySignature(message, result.signature);
      expect(isValid).toBe(true);
    });
  });
});
