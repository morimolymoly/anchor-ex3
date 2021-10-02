const assert = require('assert');
const anchor = require('@project-serum/anchor');
const { SystemProgram } = anchor.web3;

describe('ex3', () => {

  const provider = anchor.Provider.local();

  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  const counter = anchor.web3.Keypair.generate();
  const program = anchor.workspace.Ex3;

  it('create a counter', async () => {
    await program.rpc.create(provider.wallet.publicKey, {
      accounts: {
        counter: counter.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [counter],
    });

    let counterAcc = await program.account.counter.fetch(counter.publicKey);

    assert.ok(counterAcc.authority.equals(provider.wallet.publicKey));
    assert.ok(counterAcc.count.toNumber() ==  0);
  });

  it('update a counter', async () => {
    await program.rpc.increment({
      accounts: {
        counter: counter.publicKey,
        authority: provider.wallet.publicKey,
      },
    })

    const counterAcc = await program.account.counter.fetch(counter.publicKey);

    assert.ok(counterAcc.authority.equals(provider.wallet.publicKey))
    assert.ok(counterAcc.count.toNumber() == 1)
  });
});
