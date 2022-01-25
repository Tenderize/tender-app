import { SwapEvent } from "../types/schema"
import { Swap } from "../types/templates/TenderSwap/TenderSwap";

export function handleSwapEvent(swapEvent: Swap): void {
    // Save raw event
    let event = new SwapEvent(swapEvent.transaction.hash.toHex());
    event.from = swapEvent.params.buyer.toHex()
    event.tokenSold = swapEvent.params.tokenSold.toHex()
    event.amountSold = swapEvent.params.amountSold
    event.amountReceived = swapEvent.params.amountReceived
    event.timestamp = swapEvent.block.timestamp
    event.save()
}