import type { ChainAdapter, SIWxMessage, SignatureResult, VerificationParams } from "../types";

export class EIP155Adapter implements ChainAdapter {
  namespace = "eip155" as const;

  private getChainName(chainId: string): string {
    const id = chainId.split(":")[1];
    const chainNames: Record<string, string> = {
      "1": "Ethereum",
      "5": "Ethereum Goerli",
      "11155111": "Ethereum Sepolia",
      "10": "Optimism",
      "137": "Polygon",
      "42161": "Arbitrum One",
      "8453": "Base",
      "56": "BNB Smart Chain",
      "43114": "Avalanche C-Chain",
      "250": "Fantom",
      "100": "Gnosis",
    };
    return chainNames[id] || "EVM";
  }

  formatMessage(message: SIWxMessage): string {
    const parts: string[] = [];
    const chainName = this.getChainName(message.chainId);

    parts.push(`${message.domain} wants you to sign in with your ${chainName} account:`);
    parts.push(message.address);
    parts.push("");

    if (message.statement) {
      parts.push(message.statement);
      parts.push("");
    }

    parts.push(`URI: ${message.uri}`);
    parts.push(`Version: ${message.version}`);
    parts.push(`Chain ID: ${message.chainId.split(":")[1]}`);
    parts.push(`Nonce: ${message.nonce}`);
    parts.push(`Issued At: ${message.issuedAt}`);

    if (message.expirationTime) {
      parts.push(`Expiration Time: ${message.expirationTime}`);
    }

    if (message.notBefore) {
      parts.push(`Not Before: ${message.notBefore}`);
    }

    if (message.requestId) {
      parts.push(`Request ID: ${message.requestId}`);
    }

    if (message.resources && message.resources.length > 0) {
      parts.push("Resources:");
      message.resources.forEach((resource) => {
        parts.push(`- ${resource}`);
      });
    }

    return parts.join("\n");
  }

  async signMessage(message: SIWxMessage, privateKey: string | Uint8Array): Promise<SignatureResult> {
    const formattedMessage = this.formatMessage(message);

    try {
      const { signMessage } = await import("viem/accounts");
      const { keccak256, toBytes } = await import("viem");

      const messageHash = keccak256(toBytes(formattedMessage));
      const signature = await signMessage({
        message: formattedMessage,
        privateKey: typeof privateKey === "string" ? privateKey as `0x${string}` : `0x${Buffer.from(privateKey).toString("hex")}` as `0x${string}`,
      });

      return {
        message: formattedMessage,
        signature,
        signatureType: this.getSignatureType(),
      };
    } catch (error) {
      throw new Error(`Failed to sign message: ${error}`);
    }
  }

  async verifySignature(params: VerificationParams): Promise<boolean> {
    try {
      const { recoverMessageAddress } = await import("viem");
      const formattedMessage = this.formatMessage(params.message);

      const recoveredAddress = await recoverMessageAddress({
        message: formattedMessage,
        signature: params.signature as `0x${string}`,
      });

      return recoveredAddress.toLowerCase() === params.message.address.toLowerCase();
    } catch (error) {
      return false;
    }
  }

  getSignatureType(): string {
    return "eip191";
  }
}

export const eip155 = new EIP155Adapter();
