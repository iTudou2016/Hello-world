public static final int LOOK_BACK=1000;
private void countFound(NodeStatus ns, UserServiceBlockingStub blockingStub, String remark, TreeMap<String, Integer> blockfound)
  {
    if (ns.getHeadSummary().getHeader().getBlockHeight() < LOOK_BACK) return;
    int blocks = 0;

    while(blocks < LOOK_BACK)
    {
      ChainHash h = prev;
      CoinbaseExtras extras = null;
      Block blk = blockingStub.getBlock(RequestBlock.newBuilder().setBlockHash(h.getBytes()).build());
      extras = TransactionUtil.getInner(blk.getTransactions(0)).getCoinbaseExtras();
      if (remark.equals(HexUtil.getSafeString(extras.getRemarks()))) 
      {
        blockfound.put("block No.", blk.getHeader().getBlockHeight());
      }
      blocks++;
    }
  }
