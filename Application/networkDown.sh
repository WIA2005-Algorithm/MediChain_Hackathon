#!/bin/bash
set -ex

# Bring the test network down
pushd ../ApplicationNetwork
./network.sh down
popd
rm -rf ../ApplicationNetwork

# clean out any old identites in the wallets
rm -rf TodoBackend/wallet/*