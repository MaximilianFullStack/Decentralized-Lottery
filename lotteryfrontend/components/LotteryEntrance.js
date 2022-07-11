import { contractAddresses, abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"

export default function LotteryEntrance() {
  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
  const chainId = parseInt(chainIdHex)
  const lotteryAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null

  const [numPlayers, setNumPlayers] = useState("0")
  const [recentWinner, setRecentWinner] = useState("0")

  const dispatch = useNotification()

  let entranceFee = "100000000000000000"

  const {
    runContractFunction: EnterLottery,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "EnterLottery",
    params: {},
    msgValue: entranceFee,
  })

  //view functions

  const { runContractFunction: getNumEntries } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "getNumEntries",
    params: {},
  })

  const { runContractFunction: getWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "getWinner",
    params: {},
  })

  async function updateUI() {
    const numPlayersFromCall = (await getNumEntries()).toString()
    const WinnerFromCall = await getWinner()
    setNumPlayers(numPlayersFromCall)
    setRecentWinner(WinnerFromCall)
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI()
    }
  }, [isWeb3Enabled])

  const handleSucess = async function (tx) {
    await tx.wait(1)
    handleNewNotification(tx)
    updateUI()
  }

  const handleNewNotification = async function () {
    dispatch({
      type: "info",
      message: "Transcation Complete!",
      title: "Tx Notification",
      position: "topR",
      icon: "bell",
    })
  }

  return (
    <div className="p-5">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
        onClick={async function () {
          await EnterLottery({
            onSuccess: handleSucess,
            onError: (error) => console.log(error),
          })
        }}
        disabled={isLoading || isFetching}
      >
        {isFetching || isFetching ? (
          <div className="animate-spin spinner-border h-6 w-6 border-b-2 rounded-full"></div>
        ) : (
          <div>Enter Lottery</div>
        )}
      </button>
      <div>
        Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
      </div>
      <div>Players: {numPlayers}</div>
      <div>Winner: {recentWinner}</div>
    </div>
  )
}
