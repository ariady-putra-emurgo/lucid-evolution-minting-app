import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Button } from "@nextui-org/button";

import { Address, Constr, Data, fromText, LucidEvolution, MintingPolicy, TxSignBuilder } from "@lucid-evolution/lucid";
import { applyDoubleCborEncoding, applyParamsToScript, mintingPolicyToId } from "@lucid-evolution/utils";

const Script = {
  MintAlwaysTrue: applyDoubleCborEncoding(
    "58b801010032323232323232323225333003323232323253330083370e900018051baa0011325333333010003153330093370e900018059baa0031533300d300c37540062944020020020020020020dd7180698059baa00116300c300d002300b001300b0023009001300637540022930a998022491856616c696461746f722072657475726e65642066616c73650013656153300249010f5f72656465656d65723a20566f696400165734ae7155ceaab9e5573eae855d12ba41"
  ),

  MintCheckRedeemer: applyDoubleCborEncoding(
    "58c4010100323232323232323225333003323232323253330083370e900018051baa001132533333300f003008008008153330093370e6eb400d205414a22a660149211672656465656d6572203d3d203432203f2046616c73650014a00106eb8c030c02cdd50008b1805980600118050009805001180400098031baa001149854cc0112411856616c696461746f722072657475726e65642066616c73650013656153300249010d72656465656d65723a20496e7400165734ae7155ceaab9e5742ae895d201"
  ),

  MintCheckRedeemer2: applyDoubleCborEncoding(
    "59017e01010032323232323232323225333003323232323253330083370e900018051baa0011325333333010003153330093370e900018059baa003132533300e001009132533333301200100a00a00a00a13232533301100100c132533333301500100d00d00d1325333013301500313232533301153330113371e6eb8c05800922010d48656c6c6f2c20576f726c64210014a22a660249211e6b6579203d3d202248656c6c6f2c20576f726c642122203f2046616c73650014a02a66602266e1c005205414a22a660249211376616c7565203d3d203432203f2046616c73650014a02940dd6980a980b00098091baa00900e375a00201a602400260240066eb8004c03c004c030dd50018040040040040041bae300d300b37540022c6018601a004601600260160046012002600c6ea800452615330044911856616c696461746f722072657475726e65642066616c73650013656153300249011272656465656d65723a2052656465656d657200165734ae7155ceaab9e5573eae855d12ba41"
  ),

  MintNFT: applyDoubleCborEncoding(
    "59020301010032323232323232323232322253330053232323232533300a3370e900018061baa00113253333330130031533300b3370e900018069baa0031533300f300e375400626464a66601a64a66602400201a264a666026602c0042a66601e66e1d2002375a60240022944038038c050004c94ccc038cdc3a400460206ea800452f5bded8c026eacc050c044dd500099198008009bab3014301530153015301500322533301300114c103d87a80001323232325333013337220120042a66602666e3c0240084cdd2a4000660306e980052f5c02980103d87a80001330060060033756602a0066eb8c04c008c05c008c0540044c8cc004004008894ccc04c004528099299980819baf301630133754602c00401a29444cc00c00c004c0580045281bac3012001300e375400a0120120120120120126eb8c040c034dd50008b1807980800118070009807001180600098041baa001149854cc01924011856616c696461746f722072657475726e65642066616c73650013656153300349010f5f72656465656d65723a20566f69640016153300249159657870656374205b50616972285f2c2031295d203d0a202020206d696e740a2020202020207c3e206173736574732e746f6b656e7328706f6c6963795f6964290a2020202020207c3e20646963742e746f5f7061697273282900165734ae7155ceaab9e5573eae815d0aba257481"
  ),
};

const ScriptV2 = {
  MintAlwaysTrue: applyDoubleCborEncoding(
    "589801000032323232323232232253330054a22930a9980324811856616c696461746f722072657475726e65642066616c736500136565333333008001153330033370e900018029baa00115333007300637540022930a998020010b0a998020010b0a998020010b0a998020010b0a998020010b0a998020010b24810f5f72656465656d65723a20566f6964005734ae7155ceaab9e5573eae91"
  ),

  MintCheckRedeemer: applyDoubleCborEncoding(
    "5894010000323232322322533300553330053370e004902a0a5115330064911672656465656d6572203d3d203432203f2046616c73650014a02930a9980324811856616c696461746f722072657475726e65642066616c7365001365653333330050011533004002161533004002161533004002161375a0022a660080042c92010d72656465656d65723a20496e74005734ae715d21"
  ),

  MintCheckRedeemer2: applyDoubleCborEncoding(
    "59019301000032323232323232323223232253330063232533300853330083371e6eb8c0340092210d48656c6c6f2c20576f726c64210014a22a660129211e6b6579203d3d202248656c6c6f2c20576f726c642122203f2046616c73650014a02a66601066e1c005205414a22a660129211376616c7565203d3d203432203f2046616c73650014a02940dd69806180680098049baa003149854cc01d24011856616c696461746f722072657475726e65642066616c7365001365653330043370e900018031baa001132533300900115330060041613232533300b001153300800616132533300c300e002149854cc02401c58c94cccccc03c00454cc02401c5854cc02401c5854cc02401c584dd68008a998048038b180600098060011929999998068008a998038028b0a998038028b0a998038028b0a998038028b09bae001300a001300737540022a6600a0062ca66666601400220022a660080042c2a660080042c2a660080042c2a660080042c9211272656465656d65723a2052656465656d6572005734ae7155ceaab9e5573eae855d12ba41"
  ),

  MintNFT: applyDoubleCborEncoding(
    "59034801000032323232323232323232322232253330073253330083370e900018051baa001132323232533300c3370e90010008a99806a4810a4973204d696e74696e67001533300c323300100100322533301200114a0264a66601e66ebcc01cc048dd5180a8010060a51133003003001301500114a22a6601a9212e636f6e73756d655f7574786f28696e707574732c206f75747075745f7265666572656e636529203f2046616c73650014a02a66601866e1d2001001153300d4910a4973204275726e696e670014a22a6601a9210b496e76616c6964205174790014a064a6660200022a6601a0162c264a666022602800426eb4c04000454cc03803058c048004c94ccc030cdc3a4004601c6ea800452f5bded8c026eacc048c03cdd500099191980080099198008009bab3014301530153015301500522533301300114bd6f7b630099191919299980999b91488100002153330133371e91010000210031005133018337606ea4008dd3000998030030019bab3015003375c6026004602e004602a00244a666024002298103d87a800013232323253330123372200e0042a66602466e3c01c0084cdd2a40006602e6e980052f5c02980103d87a8000133006006003375660280066eb8c048008c058008c050004dd7180898071baa0043758602000260186ea8c004c030dd5001918078008a99804a48137657870656374204d696e7428706f6c6963795f6964293a20536372697074507572706f7365203d20636f6e746578742e707572706f73650016300d300e300a37540022930a998042491856616c696461746f722072657475726e65642066616c73650013656533333300d001153330053370e900018039baa00115333009300837540022930a998030018b0a998030018b0a998030018b0a998030018b0a998030018b0a998030018b24810f5f72656465656d65723a20566f69640049017d657870656374205b50616972285f2c20717479295d203d0a202020206d696e740a2020202020207c3e2076616c75652e66726f6d5f6d696e7465645f76616c756528290a2020202020207c3e2076616c75652e746f6b656e7328706f6c6963795f6964290a2020202020207c3e20646963742e746f5f70616972732829005734ae7155ceaab9e5573eae815d0aba257481"
  ),
};

export default function Dashboard(props: {
  lucid: LucidEvolution;
  address: Address;
  setActionResult: (result: string) => void;
  onError: (error: any) => void;
}) {
  const { lucid, address, setActionResult, onError } = props;

  async function submitTx(tx: TxSignBuilder) {
    const txSigned = await tx.sign.withWallet().complete();
    const txHash = await txSigned.submit();

    return txHash;
  }

  type Action = () => Promise<void>;
  type ActionGroup = Record<string, Action>;

  const actions: Record<string, ActionGroup> = {
    AlwaysTrue: {
      mint: async () => {
        try {
          const mintingValidator: MintingPolicy = {
            type: "PlutusV2", // TODO: PlutusV3
            script: ScriptV2.MintAlwaysTrue, // TODO: Script (V3)
          };

          const policyID = mintingPolicyToId(mintingValidator);
          const assetName = "Always True Token";

          const mintedAssets = { [`${policyID}${fromText(assetName)}`]: 1_000n };
          const redeemer = Data.void();

          const tx = await lucid
            .newTx()
            .mintAssets(mintedAssets, redeemer)
            // .pay.ToAddress(address, mintedAssets)
            .attach.MintingPolicy(mintingValidator)
            .complete();

          submitTx(tx).then(setActionResult).catch(onError);
        } catch (error) {
          onError(error);
        }
      },

      burn: async () => {
        try {
          const mintingValidator: MintingPolicy = {
            type: "PlutusV2", // TODO: PlutusV3
            script: ScriptV2.MintAlwaysTrue, // TODO: Script (V3)
          };

          const policyID = mintingPolicyToId(mintingValidator);
          const assetName = "Always True Token";
          const assetUnit = `${policyID}${fromText(assetName)}`;
          const burnedAssets = { [assetUnit]: -1_000n };
          const redeemer = Data.void();

          const utxos = await lucid.utxosAtWithUnit(address, assetUnit);

          const tx = await lucid.newTx().collectFrom(utxos).mintAssets(burnedAssets, redeemer).attach.MintingPolicy(mintingValidator).complete();

          submitTx(tx).then(setActionResult).catch(onError);
        } catch (error) {
          onError(error);
        }
      },
    },

    CheckRedeemer: {
      mint: async () => {
        try {
          const mintingValidator: MintingPolicy = {
            type: "PlutusV2", // TODO: PlutusV3
            script: ScriptV2.MintCheckRedeemer, // TODO: Script (V3)
          };

          const policyID = mintingPolicyToId(mintingValidator);
          const assetName = "Check Redeemer Token";

          const mintedAssets = { [`${policyID}${fromText(assetName)}`]: 200n };
          const redeemer = Data.to(42n);

          const tx = await lucid
            .newTx()
            .mintAssets(mintedAssets, redeemer)
            .attach.MintingPolicy(mintingValidator)
            // .pay.ToAddress(address, mintedAssets)
            .complete();

          submitTx(tx).then(setActionResult).catch(onError);
        } catch (error) {
          onError(error);
        }
      },

      burn: async () => {
        try {
          const mintingValidator: MintingPolicy = {
            type: "PlutusV2", // TODO: PlutusV3
            script: ScriptV2.MintCheckRedeemer, // TODO: Script (V3)
          };

          const policyID = mintingPolicyToId(mintingValidator);
          const assetName = "Check Redeemer Token";
          const assetUnit = `${policyID}${fromText(assetName)}`;
          const burnedAssets = { [assetUnit]: -200n };
          const redeemer = Data.to(42n);

          const utxos = await lucid.utxosAtWithUnit(address, assetUnit);

          const tx = await lucid.newTx().collectFrom(utxos).mintAssets(burnedAssets, redeemer).attach.MintingPolicy(mintingValidator).complete();

          submitTx(tx).then(setActionResult).catch(onError);
        } catch (error) {
          onError(error);
        }
      },
    },

    CheckRedeemer2: {
      mint: async () => {
        try {
          const mintingValidator: MintingPolicy = {
            type: "PlutusV2", // TODO: PlutusV3
            script: ScriptV2.MintCheckRedeemer2, // TODO: Script (V3)
          };

          const policyID = mintingPolicyToId(mintingValidator);
          const assetName = "Check Redeemer2 Token";

          const mintedAssets = { [`${policyID}${fromText(assetName)}`]: 30n };
          const redeemer = Data.to(new Constr(0, [fromText("Hello, World!"), 42n]));

          const tx = await lucid
            .newTx()
            .mintAssets(mintedAssets, redeemer)
            .attach.MintingPolicy(mintingValidator)
            // .pay.ToAddress(address, mintedAssets)
            .complete();

          submitTx(tx).then(setActionResult).catch(onError);
        } catch (error) {
          onError(error);
        }
      },

      burn: async () => {
        try {
          const mintingValidator: MintingPolicy = {
            type: "PlutusV2", // TODO: PlutusV3
            script: ScriptV2.MintCheckRedeemer2, // TODO: Script (V3)
          };

          const policyID = mintingPolicyToId(mintingValidator);
          const assetName = "Check Redeemer2 Token";
          const assetUnit = `${policyID}${fromText(assetName)}`;
          const burnedAssets = { [assetUnit]: -30n };
          const redeemer = Data.to(new Constr(0, [fromText("Hello, World!"), 42n]));

          const utxos = await lucid.utxosAtWithUnit(address, assetUnit);

          const tx = await lucid.newTx().collectFrom(utxos).mintAssets(burnedAssets, redeemer).attach.MintingPolicy(mintingValidator).complete();

          submitTx(tx).then(setActionResult).catch(onError);
        } catch (error) {
          onError(error);
        }
      },
    },

    NFT: {
      mint: async () => {
        try {
          const utxos = await lucid.wallet().getUtxos();
          const utxo = utxos[0];

          // https://aiken-lang.github.io/stdlib/cardano/transaction.html#OutputReference // V3 OutRef format
          const txHash = new Constr(0, [String(utxo.txHash)]); // TODO: this is V2 OutRef format
          const txIndex = BigInt(utxo.outputIndex);
          const outputReference = new Constr(0, [txHash, txIndex]);

          const mintingScript = applyParamsToScript(ScriptV2.MintNFT, [outputReference]);
          const mintingValidator: MintingPolicy = {
            type: "PlutusV2", // TODO: PlutusV3
            script: applyDoubleCborEncoding(mintingScript),
          };

          console.log(mintingValidator);
          setActionResult(`SAVE THIS MINTING VALIDATOR SCRIPT FOR BURNING: ${mintingValidator.script}`);

          const policyID = mintingPolicyToId(mintingValidator);
          const assetName = "NFT";

          const mintedNFT = { [`${policyID}${fromText(assetName)}`]: 1n };
          const redeemer = Data.void();

          const tx = await lucid
            .newTx()
            .collectFrom([utxo])
            .mintAssets(mintedNFT, redeemer)
            .attach.MintingPolicy(mintingValidator)
            // .pay.ToAddress(address, mintedNFT)
            .complete();

          submitTx(tx).then(setActionResult).catch(onError);
        } catch (error) {
          onError(error);
        }
      },

      burn: async () => {
        try {
          const mintingValidator: MintingPolicy = {
            type: "PlutusV2", // TODO: PlutusV3
            script:
              "59037a590377010000332323232323232323232322232253330073253330083370e900018051baa001132323232533300c3370e90010008a99806a490a4973204d696e74696e67001533300c323300100100322533301200114a0264a66601e66ebcc01cc048dd5180a8010060a51133003003001301500114a22a6601a9212e636f6e73756d655f7574786f28696e707574732c206f75747075745f7265666572656e636529203f2046616c73650014a02a66601866e1d2001001153300d4910a4973204275726e696e670014a22a6601a9210b496e76616c6964205174790014a064a6660200022a6601a0162c264a666022602800426eb4c04000454cc03803058c048004c94ccc030cdc3a4004601c6ea800452f5bded8c026eacc048c03cdd500099191980080099198008009bab3014301530153015301500522533301300114bd6f7b630099191919299980999b91488100002153330133371e91010000210031005133018337606ea4008dd3000998030030019bab3015003375c6026004602e004602a00244a666024002298103d87a800013232323253330123372200e0042a66602466e3c01c0084cdd2a40006602e6e980052f5c02980103d87a8000133006006003375660280066eb8c048008c058008c050004dd7180898071baa0043758602000260186ea8c004c030dd5001918078008a99804a48137657870656374204d696e7428706f6c6963795f6964293a20536372697074507572706f7365203d20636f6e746578742e707572706f73650016300d300e300a37540022930a998042491856616c696461746f722072657475726e65642066616c73650013656533333300d001153330053370e900018039baa00115333009300837540022930a998030018b0a998030018b0a998030018b0a998030018b0a998030018b0a998030018b24810f5f72656465656d65723a20566f69640049017d657870656374205b50616972285f2c20717479295d203d0a202020206d696e740a2020202020207c3e2076616c75652e66726f6d5f6d696e7465645f76616c756528290a2020202020207c3e2076616c75652e746f6b656e7328706f6c6963795f6964290a2020202020207c3e20646963742e746f5f70616972732829005734ae7155ceaab9e5573eae815d0aba257489812bd8799fd8799f582058acd5b4ba7ad0e37ea9d105308d5091fad24c23ed47a2286f66fe1cda501bc5ff00ff0001",
          };

          const policyID = mintingPolicyToId(mintingValidator);
          const assetName = "NFT";
          const assetUnit = `${policyID}${fromText(assetName)}`;
          const burnedNFT = { [assetUnit]: -1n };
          const redeemer = Data.void();

          const utxos = await lucid.utxosAtWithUnit(address, assetUnit);

          const tx = await lucid.newTx().collectFrom(utxos).mintAssets(burnedNFT, redeemer).attach.MintingPolicy(mintingValidator).complete();

          submitTx(tx).then(setActionResult).catch(onError);
        } catch (error) {
          onError(error);
        }
      },
    },
  };

  return (
    <div className="flex flex-col gap-2">
      <span>{address}</span>

      <Accordion variant="splitted">
        {/* Always True */}
        <AccordionItem key="1" aria-label="Accordion 1" title="Always True">
          <div className="flex flex-wrap gap-2 mb-2">
            <Button className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg capitalize" radius="full" onClick={actions.AlwaysTrue.mint}>
              Mint
            </Button>
            <Button className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg capitalize" radius="full" onClick={actions.AlwaysTrue.burn}>
              Burn
            </Button>
          </div>
        </AccordionItem>

        {/* Check Redeemer */}
        <AccordionItem key="2" aria-label="Accordion 2" title="Check Redeemer">
          <div className="flex flex-wrap gap-2 mb-2">
            <Button
              className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg capitalize"
              radius="full"
              onClick={actions.CheckRedeemer.mint}
            >
              Mint
            </Button>
            <Button
              className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg capitalize"
              radius="full"
              onClick={actions.CheckRedeemer.burn}
            >
              Burn
            </Button>
          </div>
        </AccordionItem>

        {/* Check Redeemer2 */}
        <AccordionItem key="3" aria-label="Accordion 3" title="Check Redeemer2">
          <div className="flex flex-wrap gap-2 mb-2">
            <Button
              className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg capitalize"
              radius="full"
              onClick={actions.CheckRedeemer2.mint}
            >
              Mint
            </Button>
            <Button
              className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg capitalize"
              radius="full"
              onClick={actions.CheckRedeemer2.burn}
            >
              Burn
            </Button>
          </div>
        </AccordionItem>

        {/* NFT */}
        <AccordionItem key="4" aria-label="Accordion 4" title="NFT">
          <div className="flex flex-wrap gap-2 mb-2">
            <Button className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg capitalize" radius="full" onClick={actions.NFT.mint}>
              Mint
            </Button>
            <Button className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg capitalize" radius="full" onClick={actions.NFT.burn}>
              Burn
            </Button>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
