# lib-tokens

Encoding and decoding information packing into a `uint256` token ID.

This is used to allow for NFT token IDs to store "intrinsic information" about the token within the exiting mechanism of the ERC-721 spec.

## Encoding

* version - 1 byte @ byte 31
* checksum - 1 byte @ byte 30
* collection number - 2 bytes @ byte 28
* sequence number - 2 bytes @ byte 26
* mint date (daystamp) - 2 bytes @ byte 24
* created date (daystamp) - 2 bytes @ byte 22
* edition number - 2 bytes @ byte 20
* edition total - 2 bytes @ byte 18
* asset type - 1 byte @ byte 17
* width - 2 bytes @ byte 15
* height - 2 bytes @ byte 13
* reserved - 11 bytes @ byte 2
* token number - 2 bytes @ byte 0

Notes:

* Only `version = 1` is currently supported
* `daystamp` is `unix timestamp / 24 / 60 / 60` to allow for encoding a date without a specific time, and in a format that is useful in smart contract code.
* `token number` is stored at the lowest two bytes, purely for aesthetic reasons
* There are currently 11 bytes that are unused. More data can be packed in later in a back-compat way to existing IDs / parsing logic.
