import { describe, it, expect } from "vitest";
import { formatMessage, parseMessage } from "./message";
import type { SIWxMessage } from "../types";

describe("Message Formatting", () => {
  const basicMessage: SIWxMessage = {
    domain: "example.com",
    address: "0x1234567890123456789012345678901234567890",
    uri: "https://example.com/login",
    version: "1",
    chainId: "eip155:1",
    nonce: "32891757",
    issuedAt: "2021-09-30T16:25:24.000Z",
  };

  it("should format a basic message correctly", () => {
    const formatted = formatMessage(basicMessage);
    expect(formatted).toContain("example.com wants you to sign in with your account:");
    expect(formatted).toContain("0x1234567890123456789012345678901234567890");
    expect(formatted).toContain("URI: https://example.com/login");
    expect(formatted).toContain("Version: 1");
    expect(formatted).toContain("Chain ID: eip155:1");
    expect(formatted).toContain("Nonce: 32891757");
    expect(formatted).toContain("Issued At: 2021-09-30T16:25:24.000Z");
  });

  it("should include optional statement field", () => {
    const messageWithStatement: SIWxMessage = {
      ...basicMessage,
      statement: "I accept the Terms of Service",
    };
    const formatted = formatMessage(messageWithStatement);
    expect(formatted).toContain("I accept the Terms of Service");
  });

  it("should include optional fields when present", () => {
    const fullMessage: SIWxMessage = {
      ...basicMessage,
      statement: "Sign in to Example.com",
      expirationTime: "2021-09-30T18:25:24.000Z",
      notBefore: "2021-09-30T16:20:24.000Z",
      requestId: "request-123",
      resources: [
        "ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
        "https://example.com/my-claim.json",
      ],
    };

    const formatted = formatMessage(fullMessage);
    expect(formatted).toContain("Sign in to Example.com");
    expect(formatted).toContain("Expiration Time: 2021-09-30T18:25:24.000Z");
    expect(formatted).toContain("Not Before: 2021-09-30T16:20:24.000Z");
    expect(formatted).toContain("Request ID: request-123");
    expect(formatted).toContain("Resources:");
    expect(formatted).toContain("- ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu");
    expect(formatted).toContain("- https://example.com/my-claim.json");
  });

  it("should parse a formatted message back to object", () => {
    const formatted = formatMessage(basicMessage);
    const parsed = parseMessage(formatted);

    expect(parsed.domain).toBe(basicMessage.domain);
    expect(parsed.address).toBe(basicMessage.address);
    expect(parsed.uri).toBe(basicMessage.uri);
    expect(parsed.version).toBe(basicMessage.version);
    expect(parsed.chainId).toBe(basicMessage.chainId);
    expect(parsed.nonce).toBe(basicMessage.nonce);
    expect(parsed.issuedAt).toBe(basicMessage.issuedAt);
  });

  it("should parse a message with all fields", () => {
    const fullMessage: SIWxMessage = {
      ...basicMessage,
      statement: "Test statement",
      expirationTime: "2021-09-30T18:25:24.000Z",
      notBefore: "2021-09-30T16:20:24.000Z",
      requestId: "request-456",
      resources: ["https://example.com/resource1", "https://example.com/resource2"],
    };

    const formatted = formatMessage(fullMessage);
    const parsed = parseMessage(formatted);

    expect(parsed.statement).toBe(fullMessage.statement);
    expect(parsed.expirationTime).toBe(fullMessage.expirationTime);
    expect(parsed.notBefore).toBe(fullMessage.notBefore);
    expect(parsed.requestId).toBe(fullMessage.requestId);
    expect(parsed.resources).toEqual(fullMessage.resources);
  });

  it("should handle round-trip formatting and parsing", () => {
    const fullMessage: SIWxMessage = {
      domain: "service.org",
      address: "GwAF45zjfyGzUbd3i3hXxzGeuchzEZXwpRYHZM5912F1",
      uri: "https://service.org/login",
      version: "1",
      chainId: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
      nonce: "32891757",
      issuedAt: "2021-09-30T16:25:24.000Z",
      statement: "I accept the ServiceOrg Terms of Service: https://service.org/tos",
      resources: [
        "ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
        "https://example.com/my-web2-claim.json",
      ],
    };

    const formatted = formatMessage(fullMessage);
    const parsed = parseMessage(formatted);
    const reformatted = formatMessage(parsed);

    expect(reformatted).toBe(formatted);
  });
});
