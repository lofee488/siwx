import { describe, it, expect } from "vitest";
import { solana } from "./solana";
import type { SIWxMessage } from "../types";

describe("Solana Adapter", () => {
  const testMessage: SIWxMessage = {
    domain: "example.com",
    address: "DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK",
    uri: "https://example.com/login",
    version: "1",
    chainId: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
    nonce: "32891757",
    issuedAt: "2021-09-30T16:25:24.000Z",
    statement: "Sign in with Solana",
  };

  it("should have correct namespace", () => {
    expect(solana.namespace).toBe("solana");
  });

  it("should return correct signature type", () => {
    expect(solana.getSignatureType()).toBe("solana:ed25519");
  });

  it("should format message with 'Solana account' text", () => {
    const formatted = solana.formatMessage(testMessage);
    expect(formatted).toContain("wants you to sign in with your Solana account:");
    expect(formatted).toContain("Chain ID: 5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp");
  });

  it("should extract chain ID from CAIP-2 format", () => {
    const formatted = solana.formatMessage(testMessage);
    expect(formatted).toContain("Chain ID: 5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp");
    expect(formatted).not.toContain("Chain ID: solana:");
  });

  it("should convert base58 to bytes correctly", () => {
    const adapter = solana as any;

    // Test with a simple base58 string
    const base58 = "1111111111111111111111111111111111111111111111";
    const bytes = adapter.base58ToBytes(base58);

    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBeGreaterThan(0);
  });

  it("should convert bytes to base58 correctly", () => {
    const adapter = solana as any;

    // Test with simple bytes
    const bytes = new Uint8Array([0, 1, 2, 3, 4, 5]);
    const base58 = adapter.bytesToBase58(bytes);

    expect(typeof base58).toBe("string");
    expect(base58.length).toBeGreaterThan(0);

    // Round trip test
    const roundTrip = adapter.base58ToBytes(base58);
    expect(roundTrip).toEqual(bytes);
  });

  it("should handle base58 with leading zeros", () => {
    const adapter = solana as any;

    // Bytes with leading zeros
    const bytes = new Uint8Array([0, 0, 1, 2, 3]);
    const base58 = adapter.bytesToBase58(bytes);
    const decoded = adapter.base58ToBytes(base58);

    expect(decoded).toEqual(bytes);
  });

  it("should format message for different Solana networks", () => {
    const devnetMessage: SIWxMessage = {
      ...testMessage,
      chainId: "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
    };

    const formatted = solana.formatMessage(devnetMessage);
    expect(formatted).toContain("Chain ID: EtWTRABZaYq6iMfeYKouRu166VU2xqa1");
  });

  it("should handle message with all optional fields", () => {
    const fullMessage: SIWxMessage = {
      ...testMessage,
      statement: "I accept the Terms of Service",
      expirationTime: "2021-09-30T18:25:24.000Z",
      notBefore: "2021-09-30T16:20:24.000Z",
      requestId: "req-123",
      resources: ["https://example.com/resource"],
    };

    const formatted = solana.formatMessage(fullMessage);
    expect(formatted).toContain("I accept the Terms of Service");
    expect(formatted).toContain("Expiration Time:");
    expect(formatted).toContain("Not Before:");
    expect(formatted).toContain("Request ID:");
    expect(formatted).toContain("Resources:");
  });
});
