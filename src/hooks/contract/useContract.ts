import {
  useReadContract as useReadContractByThird,
  useWriteContract as useWriteContractByThird,
  useWaitForTransactionReceipt as useWaitForTransactionReceiptByThird,
  type UseReadContractParameters,
  type UseWaitForTransactionReceiptParameters
} from 'wagmi'

import { type WriteContractParameters } from '@wagmi/core'

// 获取合约数据（只读方法）
function useReadContract (params: UseReadContractParameters) {
  const { data, isError, isLoading } = useReadContractByThird(params)
  return { data, isError, isLoading }
}

// 发起交易
function useWriteContract(params: WriteContractParameters) {
  const { writeContract } = useWriteContractByThird()
  writeContract(params)
}

// 查询交易状态
// 基本就是通过 useWriteContract 回调里的 hash 跟 useWriteContract 搭配使用
function useWaitForTransactionReceipt(params: UseWaitForTransactionReceiptParameters) {
  const {
    // 交易收据（Transaction Receipt），包含区块号、GasUsed等详细信息，确认成功后返回
    data,
    // 交易是否在链上确认成功
    isSuccess,
    // 交易是否在链上确认失败（例如被 revert）
    isError,
    // 失败的错误信息
    error,
    // 交易是否正在链上确认中（替代了之前的 isLoading）
    isLoading
  } = useWaitForTransactionReceiptByThird(params)
  return { data, isSuccess, isError, error, isLoading}
}

export {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  type UseReadContractParameters,
  type WriteContractParameters,
  type UseWaitForTransactionReceiptParameters
}

