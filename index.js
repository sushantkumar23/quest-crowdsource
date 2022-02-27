const {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} = require("@solana/web3.js")
const { fs } = require("mz")

async function establishConnection() {
  const rpcUrl = "http://localhost:8899"
  const connection = new Connection(rpcUrl, "confirmed")
  const version = await connection.getVersion()
  console.log("Connection to cluster established: ", rpcUrl, version)
  return connection
}

async function createKeypairFromFile() {
  const secretKeyString = await fs.readFile(
    "/Users/sushantkumar/.config/solana/id.json"
  )
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString))
  return Keypair.fromSecretKey(secretKey)
}

async function createAccount() {
  const connection = await establishConnection()
  const signer = await createKeypairFromFile()
  const newAccountPubkey = await PublicKey.createWithSeed(
    signer.publicKey,
    "campaign1",
    new PublicKey("AcYnU272TTx4m1WYkPSbGyhQpWjfmFBfGQXY3SZ2XrNW")
  )
  const lamports = await connection.getMinimumBalanceForRentExemption(1024)

  const instruction = SystemProgram.createAccountWithSeed({
    fromPubkey: signer.publicKey,
    basePubkey: signer.publicKey,
    seed: "campaign1",
    newAccountPubkey,
    lamports,
    space: 1024,
    programId: new PublicKey("AcYnU272TTx4m1WYkPSbGyhQpWjfmFBfGQXY3SZ2XrNW"),
  })

  const transaction = new Transaction().add(instruction)
  console.log(
    `The address of campaign1 account is: ${newAccountPubkey.toBase58()}`
  )
  await sendAndConfirmTransaction(connection, transaction, [signer])
}

createAccount()
