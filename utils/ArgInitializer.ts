import { pad, toHex } from "viem";
import { ZERO_ADDRESS } from "@yearn-finance/web-lib/utils/constants";
import type { TAddress } from "@yearn-finance/web-lib/types";
import { toAddress } from "@yearn-finance/web-lib/utils/address";

const FALLBACK_HANDLER = toAddress(
  "0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4"
);
const ZERO = "0";

export function generateArgInitializers(
  owners: TAddress[],
  threshold: number
): string {
  return (
    "b63e800d" + //Function signature
    "100".padStart(64, "0") + // Version
    threshold.toString().padStart(64, "0") + // Threshold
    ZERO_ADDRESS.substring(2).padStart(64, "0") + // Address zero, TO
    pad(toHex(0x120 + 0x20 * owners.length))
      .substring(2)
      .padStart(64, "0") + // Data length
    FALLBACK_HANDLER.substring(2).padStart(64, "0") +
    ZERO_ADDRESS.substring(2).padStart(64, "0") + // paymentToken
    ZERO.padStart(64, "0") + // payment
    ZERO_ADDRESS.substring(2).padStart(64, "0") + // paymentReceiver
    owners.length.toString().padStart(64, "0") + // owners.length
    owners
      .map((owner): string => owner.substring(2).padStart(64, "0"))
      .join("") + // owners
    ZERO.padStart(64, "0") // data.length
  );
}
